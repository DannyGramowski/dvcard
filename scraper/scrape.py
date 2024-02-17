import requests

atoz = "https://askjan.org/a-to-z.cfm"
dinfo = "https://askjan.org/disabilities/"

res = requests.get(atoz).text

fullsplit = res.split('a href="/disabilities/')

l = len(fullsplit)
i = 0
items = []
while i < l - 1:
    lst = fullsplit[1+i].split('</a>')[0].split('">')
    items.append((lst[0], lst[1]))
    i += 1

categories = {}

# categories
starts = res.split("""<option value="">- None -</option>\n""")[1].split("</select>")[0].split('option value="')[1:]
cats = []
for item in starts:
    i = item.split("</option>")[0].split('">')
    cats.append((i[0], i[1]))

#print(cats)
# cats
starts = res.split("""<div class="typeahead-list typeahead-flexcontainer" id="disability-list">\n""")[1].split("</div>\n</div>")[0].split('div data-cat="')[1:]
maps = {}
for item in starts:
    cat_and_d = item.split('" data-val')[0]
    name = item.split('.cfm">')[1].split('</a>')[0]
    cat = cat_and_d[:-1*(len(name)+1)]
    name = name.replace('/', ' / ')
    if not cat:
        continue
    s_on_sds = cat.split(' - ')
    results = s_on_sds[0].split('-')
    if len(s_on_sds) > 1:
        results = [results[0], results[1]+' - '+s_on_sds[1]]
    #print(results)
    for c in results:
        if not c in maps.keys():
            maps[c] = []
        maps[c].append(name)
        
maps['AIDS / HIV'] = maps['acquired immune deficiency syndrome (aids)/human immunodeficiency virus (hiv)']
maps.pop('acquired immune deficiency syndrome (aids)/human immunodeficiency virus (hiv)')
maps['ADD / ADHD'] = maps['attention deficit disorder or attention deficit/hyperactivity disorder']
maps.pop('attention deficit disorder or attention deficit/hyperactivity disorder')
maps['Anxiety / Panic Disorder'] = maps['anxiety/panic disorder']
maps.pop('anxiety/panic disorder')
maps.pop('cause known - speech')
maps.pop('cause known - vision')
maps.pop('cause unknown - hearing')
maps.pop('cause unknown - vision')


disabilities = []

for d in items:
    filled = {'link': d[0], 'name': d[1].replace('/', ' / '), 'symptoms': [], 'description': 'NO'}
    res = requests.get(dinfo+d[0]).text
    if d[1] == 'Neurodiversity':
        description = res.split('</h3>\n<p>')[1].split('</p>')[0]
    else:
        description = res.split('</h2>\n<p>')[1].split('</p>')[0]
    descs_1 = description.split('<a')
    descs = []
    for desc in descs_1:
        for k in desc.split('/a>'):
            descs.append(k)
    descs_subfinal = []
    for desc in descs:
        if desc.endswith('<'):
            descs_subfinal += ['>', desc.split('>')[1][:-1], '<']
        else:
            descs_subfinal += [desc]
    descs = descs_subfinal
    desc_final = ''.join(descs[::2])
    desc_final = desc_final.replace('&quot;', '"')
    filled['description'] = desc_final
    if d[1] == 'COVID-19':
        disabilities.append(filled)
        continue
    print(d[1].replace('/', ' / '))
    table = res.split('<div data-state="closed" class="accordion accordion-border clearfix">')[1]
    titems = table.split('<i class="acc-open icon-chevron-down"></i>\n')[1:]
    for item in titems:
        title = item.split('\n</h5>')[0]
        sy = {'name': title, 'acc': []}
        accommodations = item.split('<li><a href="/solutions/')[1:]
        allacc = []
        for a in accommodations:
            info = a.split('</a>')[0]
            s = info.split('">')
            allacc.append((s[0], s[1]))
            sy['acc'].append({'name': s[1], 'link': s[0]})
        filled['symptoms'].append(sy)
    
    disabilities.append(filled)
    #print(filled)
        #print(accommodations)
    #print(items)
    #print(table)

def get_json(o, t):
    def format(v):
        if isinstance(v, int):
            return str(v)
        if isinstance(v, str):
            e = v.replace("'", r"\'")
            return f"'{e}'"
        if isinstance(v, list):
            if t == 's':
                return '[' + ', '.join([f'this.accommodations[{i}]' for i in v]) + ']' 
            elif t == 'd':
                return '[' + ', '.join([f'this.symptoms[{i}]' for i in v]) + ']' 
            elif t == 'c':
                return '[' + ', '.join([f'this.disabilities[{i}]' for i in v]) + ']' 
    s = "{"
    for k in o:
        s += f"{k}: {format(o[k])}, "
    s += "},\n"
    return s

# add all symptoms to set
dtoid = dict()
dct = 0
stoid = dict()
symptoms = []
sct = 0
atoid = dict()
accommodations = []
act = 0
disabilities_final = []
for i_d, d in enumerate(disabilities):
    dtoid[d['name']] = dct
    dct += 1
    sym = []
    for i_s, s in enumerate(d['symptoms']):
        acc = []
        for i_a, a in enumerate(s['acc']):
            if not atoid.get(a['name']):
                atoid[a['name']] = act
                accommodations.append({'id': act, 'name': a['name'], 'link': "https://askjan.org/solutions/"+a['link'], 'description': ''})
                act += 1
            acc.append(atoid[a['name']])
        if not stoid.get(s['name']):
            stoid[s['name']] = sct
            symptoms.append({'id': sct, 'name': s['name'], 'description': '', 'accommodations': acc})
            sct += 1
            # This is an imperfect approach because it only gets the accommodations for the first instance of each symptom.
        sym.append(stoid[s['name']])
    disabilities_final.append({'id': dct, 'name': d['name'], 'link': "https://askjan.org/disabilities/"+d['link'], 'description': d['description'], 'extrainfo': '', 'symptoms': sym, 'accommodations': []})

#print(accommodations)
    
categories = []
for i_c, c in enumerate(maps.keys()):
    categories.append({'id': i_c, 'name': c.upper(), 'disabilities': [dtoid[i] for i in maps[c]]})

res_string = f"""
accommodations: Accommodation[] = [
"""

for acc in accommodations:
    res_string += get_json(acc, 'a')

res_string += """];
symptoms: Symptom[] = [
"""

for sym in symptoms:
    res_string += get_json(sym, 's')

res_string += """];
disabilities: Disability[] = [
"""

for dis in disabilities_final:
    res_string += get_json(dis, 'd')

res_string += """];
categories: Category[] = [
"""

for cat in categories:
    res_string += get_json(cat, 'c')

res_string += """];
"""

#print(res_string)

with open('output.txt', 'w', encoding='utf-8') as f:
    f.write(res_string)

"""
accommodations: Accommodation[] = [
    {id: 0, name: 'Accessible facility (Ramps, parking etc.)', description: ''}
  ]
  symptoms: Symptom[] = [
    {id: 0, name: 'Fatigue / Weakness', description: 'Individuals may experience decreased stamina or fatigue, making it challenging to perform physically demanding tasks or tolerate extended work hours.', accommodations: [this.accommodations[0]]},
  ];
  disabilities: Disability[] = [
    {id: 0, name: 'Human Immunodeficiency Virus (HIV)', description: 'HIV (Human Immunodeficiency Virus), the virus that causes AIDS, is a life-long disease that compromises the body’s immune system, making it difficult to fight-off illnesses and other diseases. HIV infection leads to AIDS (Acquired Immunodeficiency Syndrome) when the CD4 cells, also known as T Cells, of the immune system are destroyed to the point where the body cannot fight off infections and diseases. AIDS in the final stage of HIV infection. Due to improved treatment, many individuals with HIV continue to work without needing any accommodations.', extrainfo: '', symptoms: [this.symptoms[0], this.symptoms[0], this.symptoms[0], this.symptoms[0]], accommodations: []},
    {id: 1, name: 'Alcoholism', description: 'Alcoholism, also called “alcohol dependence,” is a disease that includes four symptoms: craving (a strong need, or compulsion, to drink), loss of control (the inability to limit one’s drinking on any given occasion), physical dependence (withdrawal symptoms, such as nausea, sweating, shakiness, and anxiety, occur when alcohol use is stopped after a period of heavy drinking), and tolerance (the need to drink greater amounts of alcohol in order to “get high”). Alcoholism treatment works for many people, but just like any chronic disease, there are varying levels of success when it comes to treatment. Alcoholism treatment programs use both counseling and medications to help a person stop drinking.', extrainfo: '', symptoms: [], accommodations: []}
  ]
  categories: Category[] = [{id: 0, name: 'AIDS / HIV', disabilities: [this.disabilities[0]]}, {id: 1, name: 'ADDICTION', disabilities: []}, {id: 2, name: 'ALLERGIES', disabilities: []}, {id: 3, name: 'AMPUTATION', disabilities: []}, {id: 4, name: 'ANXIETY / PANIC DISORDER', disabilities: []}, {id: 5, name: 'ADD / ADHD', disabilities: []}, {id: 6, name: 'BLOOD DISORDERS', disabilities: []}, {id: 7, name: 'BODY SIZE', disabilities: []}, {id: 8, name: 'BRAIN INJURY', disabilities: []}, {id: 9, name: 'CONGENITAL', disabilities: []}, {id: 10, name: 'COVID-19 RELATED', disabilities: []}, {id: 11, name: 'GASTROINTESTINAL DISORDERS', disabilities: []}, {id: 12, name: 'HEADACHES', disabilities: []}, {id: 13, name: 'HEARING IMPAIRMENT', disabilities: []}, {id: 14, name: 'HEART CONDITION', disabilities: []}, {id: 15, name: 'HEIGHT', disabilities: []}, {id: 16, name: 'INTELLECTUAL IMPAIRMENT', disabilities: []}, {id: 17, name: 'LEARNING DISABILITY', disabilities: []}, {id: 18, name: 'MENTAL HEALTH CONDITIONS', disabilities: []}, {id: 19, name: 'PALSY', disabilities: []}, {id: 20, name: 'PARALYSIS', disabilities: []}, {id: 21, name: 'SPEECH IMPAIRMENT', disabilities: []}, {id: 22, name: 'VISION IMPAIRMENT', disabilities: []}, {id: 23, name: 'WEIGHT', disabilities: []}];


'AIDS / HIV', disabilities: [this.disabilities[0]]}, {id: 1, name: 'ADDICTION', disabilities: []}, {id: 2, name: 'ALLERGIES', disabilities: []}, {id: 3, name: 'AMPUTATION', disabilities: []}, {id: 4, name: 'ANXIETY / PANIC DISORDER', disabilities: []}, {id: 5, name: 'ADD / ADHD', disabilities: []}, {id: 6, name: 'BLOOD DISORDERS', disabilities: []}, {id: 7, name: 'BODY SIZE', disabilities: []}, {id: 8, name: 'BRAIN INJURY', disabilities: []}, {id: 9, name: 'CONGENITAL', disabilities: []}, {id: 10, name: 'COVID-19 RELATED', disabilities: []}, {id: 11, name: 'GASTROINTESTINAL DISORDERS', disabilities: []}, {id: 12, name: 'HEADACHES', disabilities: []}, {id: 13, name: 'HEARING IMPAIRMENT', disabilities: []}, {id: 14, name: 'HEART CONDITION', disabilities: []}, {id: 15, name: 'HEIGHT', disabilities: []}, {id: 16, name: 'INTELLECTUAL IMPAIRMENT', disabilities: []}, {id: 17, name: 'LEARNING DISABILITY', disabilities: []}, {id: 18, name: 'MENTAL HEALTH CONDITIONS', disabilities: []}, {id: 19, name: 'PALSY', disabilities: []}, {id: 20, name: 'PARALYSIS', disabilities: []}, {id: 21, name: 'SPEECH IMPAIRMENT', disabilities: []}, {id: 22, name: 'VISION IMPAIRMENT', disabilities: []}, {id: 23, name: 'WEIGHT'
"""