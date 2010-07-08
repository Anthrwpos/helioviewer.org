/**
 * @description Abstract class that keeps track of previous media made and controls the display bar and tooltips associated with it.
 * @author <a href="mailto:jaclyn.r.beck@gmail.com">Jaclyn Beck</a>
 */
/*jslint browser: true, white: true, onevar: true, undef: true, nomen: false, eqeqeq: true, plusplus: true, 
bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxlen: 120, sub: true */
/*global Class, $, Shadowbox, setTimeout, window */
"use strict";
var MediaHistoryBar = Class.extend(
    /** @lends MediaHistoryBar.prototype */
    {
    /**
     * @constructs
     * @param id a unique id that identifies which container it belongs to,
     *           either "screenshot" or "movie".
     */    
    init: function (id) {
        this.id = id;
        this.container = $("#qtip-" + this.id);
        this.button    = $("#" + this.id + "-button");
        this.history   = [];
        this.content   = "";
        this.hasDialog = false;
    },
    
    /**
     * Adds the new item to history and re-makes the history dialog with the new item
     * included. 
     */
    addToHistory: function (item) {        
        if (this.hasDialog) {
            $.each(this.history, function () {
                this.removeTooltip();
            });
            
            var api = this.container.qtip("api");
            api.elements.tooltip.remove();
        } else {
            this.hasDialog = true;
        }
        
        this.history.push(item);
        this.createContentString();
        // It is necessary to completely recreate the tooltip because if you update the content only,
        // any selectors that depend on previous content will break and all movie information tooltips
        // have to be re-created anyway.
        this._setupDialog();
        $(document).trigger("save-setting", [this.id + "-history", this.history]);
    },
    
    /**
     * Hides its dialog
     */
    hide: function () {
        this.container.qtip('hide');
    },
    
    /**
     * Adds divs for the new item including a text link and an empty, hidden div where the dialog
     * for playing the movie will be created. Adds the item to the front of the list so that the list
     * is in reverse chronological order.
     * 
     * @param item A Movie or Screenshot object
     */
    createContentString: function () {
        var self = this;
        this.content = "";
        $.each(this.history, function () {
            self.content =  "<div id='" + this.id + "' class='text-btn' float: left'>" + 
                                this.name + 
                            "</div>" +
                            "<div style='float:right; font-size: 8pt;'>" + 
                                "<i>" + this.getTimeDiff() + "</i>" + 
                            "</div>" +
                            "<div id='watch-dialog-" + this.id + "' style='display:none'>" +
                            "</div><br /><br />" + 
                            self.content;
        });
    },
    
    /**
     * Creates a dialog with the title "History" and a list of recently made media. 
     * When done, triggers the event "setup-information-tooltip", which should be 
     * received by Movie.js or Screenshot.js
     * 
     * The target field in show and hide points to either Movie-Button or Screenshot-Button,
     * so the dialog is shown or hidden when that button is clicked rather than when 
     * this.container is clicked. 
     */
    _setupDialog: function () {
        var self, divContent;
        self = this;
        
        this.container.qtip({
            position: {
                target: self.button,
                corner: {
                    target : 'bottomMiddle',
                    tooltip: 'topMiddle'
                },
                adjust: { y : 65 }
            },
            show   : { 
                when  : {
                    event : 'click',
                    target: self.button
                }
            },
            hide   : {
                when  : {
                    event : 'click',
                    target: self.button
                }
            },                      
            content: {
                title : "History",
                text  : self.content
            },
            style  : "mediaDark",
            api    : {
                onRender: function () {
                    $.each(self.history, function () {
                        this.setupTooltip();
                    });
                }
            }
        });

       $("#social-buttons").click(function () {
            self.container.qtip('hide');
       });
    }
});