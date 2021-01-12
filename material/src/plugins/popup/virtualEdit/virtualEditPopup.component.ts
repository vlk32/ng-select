import {ChangeDetectionStrategy, Component, ViewChild} from '@angular/core';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {EditPopupComponent, NgSelectPlugin, ɵNgSelectOption} from '@anglr/select';

import {VirtualEditPopup, VirtualEditPopupOptions} from './virtualEditPopup.interface';

//TODO - resize and scroll
//TODO - too few items and height
//TODO - dynamic width update and collision with viewport

/**
 * Component used for rendering virtual edit popup with options
 */
@Component(
{
    selector: "div.ng-select-virtual-edit-popup",
    templateUrl: 'virtualEditPopup.component.html',
    styleUrls: ['virtualEditPopup.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VirtualEditPopupComponent extends EditPopupComponent implements VirtualEditPopup, NgSelectPlugin<VirtualEditPopupOptions>
{
    //######################### protected properties #########################

    /**
     * Currently stored max width of displayed popup
     */
    protected _maxWidth: number = 0;

    //######################### public properties - children #########################

    // /**
    //  * 
    //  */
    // @ViewChildren('popupOptions')
    // public popupOptions: QueryList<ElementRef>;

    /**
     * View port that is used for virtual scrolling
     */
    @ViewChild(CdkVirtualScrollViewport)
    public viewPort: CdkVirtualScrollViewport;

    //######################### protected properties #########################

    /**
     * Gets currently available options
     */
    protected get availableOptions(): ɵNgSelectOption[]
    {
        return this.pluginBus.selectOptions.optionsGatherer.availableOptions;
    }

    //######################### public properties #########################

    public invalidateVisuals()
    {
        super.invalidateVisuals();

        this._scrollToOption();
    }

    /**
     * Toggles popup visibility
     */
    protected togglePopup(): void
    {
        super.togglePopup();

        if(this.viewPort)
        {
            this.viewPort.elementScrolled().subscribe(() =>
            {
                let viewportElement = this.viewPort?.getElementRef().nativeElement;

                if(viewportElement)
                {
                    let width = viewportElement.children.item(0).clientWidth;

                    if(width > this._maxWidth)
                    {
                        this._maxWidth = width;
                        viewportElement.style.width = `${viewportElement.children.item(0).clientWidth}px`;
                    }
                }
            });

            setTimeout(() =>
            {
                let viewportElement = this.viewPort?.getElementRef().nativeElement;
                
                viewportElement.style.width = `${viewportElement.children.item(0).clientWidth}px`;
            }, 0);
            
            this.viewPort.getElementRef().nativeElement.style.height = this.popupElement.style.maxHeight;
            this.viewPort.checkViewportSize();
        }
        else
        {
            this._maxWidth = 0;
        }
    }

    private _scrollToOption()
    {
        const activeOption = this.availableOptions.find(itm => itm.active);
        const index = activeOption ? this.availableOptions.indexOf(activeOption) : 0;

        this.viewPort?.scrollToIndex(index);

        // if (index === 0)
        // {
        //     // scrollTop = 0;
        // }
        // else
        // {
        //     // scrollTop = this._getOptionScrollPosition(this.viewPort.elementRef.nativeElement?.scrollTop);
        // }

        // console.log(scrollTop);

        // if (this.popupElement)
        // {
        //     this.viewPort.elementRef.nativeElement.scrollTop = scrollTop;
        // }
    }

    // private _getOptionScrollPosition(currentScrollPosition: number)
    // {
    //     const activeOptionsElement = this.popupOptions.toArray().find(el => el.nativeElement.classList.contains('active'))?.nativeElement;
    //     const top = activeOptionsElement?.offsetTop;
    //     const bottom = top + activeOptionsElement?.offsetHeight;
        
    //     if (bottom > this.popupElement?.clientHeight + currentScrollPosition)
    //     {
    //         return Math.max(bottom - this.popupElement?.clientHeight);
    //     }
    //     else if (top < currentScrollPosition)
    //     {
    //         return Math.max(0, top);
    //     }

    //     return currentScrollPosition;
    // }
}