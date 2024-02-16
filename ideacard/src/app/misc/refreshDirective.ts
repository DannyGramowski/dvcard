import { AfterViewChecked, AfterViewInit, Directive, EventEmitter, OnInit, Output } from "@angular/core";

@Directive({
    standalone: true,
    selector: '[refresh]'
})
export class RefreshDirective implements AfterViewInit {
    @Output() init = new EventEmitter();
    ngAfterViewInit() {
        this.init.emit()
    }
}