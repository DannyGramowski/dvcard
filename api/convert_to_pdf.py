"""
File for converting a docx object loaded via python-docx to a pdf file.
Functionality is not fully complete, but works for our purposes.

Author: Brandon Faunce
"""

import docx
from docx.shared import Inches
import reportlab.pdfgen as pdf
from reportlab.lib.units import inch
from reportlab.pdfgen.canvas import Canvas
from reportlab.lib.pagesizes import letter
from reportlab.platypus import Paragraph, Frame
from reportlab.lib.styles import ParagraphStyle

LOGO_FNAME = "assets/Sample_logo.png"
LOGO_H = 0.4
LOGO_W = 0.6
QR_FNAME = "assets/Sample_qr.png"
QR_H = 0.6
QR_W = 0.6
# TODO make qr variable

def convert(doc):
    print(doc)

    CURRENT_FONT_SIZE = 0
    IS_BOLD = False
    LEFT_MARGIN, RIGHT_MARGIN, TOP_MARGIN, BOTTOM_MARGIN = 1, 1, 1, 1
    
    W, H = letter
    H = H / inch
    W = W / inch

    def psize(docsize):
        return docsize * inch
    
    def hsize(y):
        return psize(H - y)

    def font_size(size):
        c.setFont("Times-Roman", size)
        CURRENT_FONT_SIZE = size
    def bold(on):
        if on:
            c.setFont("Times-Bold", CURRENT_FONT_SIZE)
        else:
            c.setFont("Times-Roman", CURRENT_FONT_SIZE)

    def draw_table(table, x, y):
        height = 0
        for i, row in enumerate(table.rows):
            height += draw_table_row(table, row, x, y)

        return height
    
    def draw_table_row(table, row, x, y):
        height = 0
        if row.height:
            height = (row.height / Inches(1)).inches
        else:
            curr_x = x
            for i, cell in enumerate(row.cells):
                cell_height = 0
                width = 0
                print(table.columns[i].width, cell.width)
                if table.columns[i].width:
                    width = table.columns[i].width / Inches(1)
                elif cell.width:
                    width = cell.width / Inches(1)
                    # TODO width doesn't account for col width
                else:
                    width = (W-LEFT_MARGIN-RIGHT_MARGIN) / len(row.cells)
                for part in cell.iter_inner_content():
                    # TODO update for nested tables if necessary
                    cell_height += draw_paragraph(part, curr_x, y, width)
                    # TODO account for cell padding
                curr_x += width
                height = max(cell_height, height)
            # min of all cols

        return height
    
    def draw_paragraph(p, x, y, w):
        height = 0
        # TODO check for bullets
        #print(p._p.xml)
        
        for run in p.iter_inner_content():
            for i in run.iter_inner_content():
                if isinstance(i, docx.drawing.Drawing):
                    #print(run._r.xml)
                    #print(i._drawing.xml)
                    fname = i._drawing.xml.split('id="0" name="')[1].split('"/>')[0]
                    print(fname)
                    if fname == 'Sample_logo.png':
                        c.drawImage(LOGO_FNAME, psize(x), psize(y), width=psize(LOGO_W), height=psize(LOGO_H), mask='auto')
                    if fname == 'Sample_qr.png':
                        c.drawImage(QR_FNAME, psize(x), psize(y), width=psize(QR_W), height=psize(QR_H), mask='auto')
                else:
                    # TODO check bold and font
                    font_size = 11
                    if run.font.size:
                        font_size = run.font.size.pt
                    font_name = "Times-Roman"
                    if run.font.bold:
                        font_name = "Times-Bold"
                    pstyle = ParagraphStyle("test", alignment=1, fontName=font_name, fontSize=font_size)
                    paragraph = Paragraph(i, pstyle)
                    _, h = paragraph.wrap(psize(w), psize(H-y-BOTTOM_MARGIN))
                    h /= inch
                    height += h
                    f = Frame(psize(x), psize(BOTTOM_MARGIN), psize(w), psize(H-y-BOTTOM_MARGIN), showBoundary=1)
                    f.addFromList([paragraph], c)
                    c.drawString(psize(x), psize(y), i)
        return height


    c = Canvas("test.pdf", pagesize=letter)
    font_size(11)
    x = LEFT_MARGIN
    y = TOP_MARGIN
    for part in doc.iter_inner_content():
        if isinstance(part, docx.table.Table):
            y += draw_table(part, x, y)
        else:
            y += draw_paragraph(part, x, y, W-LEFT_MARGIN-RIGHT_MARGIN)
    #c.drawString(inch,inch,"Hello World!")
    c.save()

