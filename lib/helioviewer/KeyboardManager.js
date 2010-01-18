/**
 * @fileOverview
 * @author <a href="mailto:keith.hughitt@nasa.gov">Keith Hughitt</a>
 */
/*globals document, $, Class */
"use strict";
var KeyboardManager = Class.extend(
/** @lends KeyboardManager.prototype */
{
    /**
     * @constructs
     */
    init: function (controller) {
		this.controller = controller;
        this._initEventHandlers();
    },
    

    /**
     * @description Initialize keyboard-related event handlers.
     * 
     * TODO: use events or public method instead of zoomControl's (private) method.
     * 
     * TODO (2009/07/29): Webkit doesn't support keypress events for non alphanumeric
     * keys (http://ejohn.org/blog/keypress-in-safari-31/).
     * 
     * Instead of using keypress, it may be better to use keydown and a boolean to decide 
     * when vp is moving and when it should be stationary.
     * 
     * Simple implementation:
     *     vp.movingUp (Boolean), vp.movingDown (Boolean), vp.movingLeft (Boolean), vp.movingRight (Boolean)
     *     
     * From there it is also simple to add support for diagonal movement, etc.
     */
    _initEventHandlers: function () {
        var self = this;

        // Event-handlers
        $(document).keypress(function (e) {
            if (e.target.tagName !== "INPUT")
                self._keyPress(e);
        })
    },
    
    /**
     * @description Sets up keyboard shortcuts
     * @TODO 01/04/2010: Use something like js-hotkeys (http://code.google.com/p/js-hotkeys/) to allow for more advanced
     *                   keyboard navigation such as "cntl + z" to undo, etc
     * TODO 01/16/2009: Create buttons for mouse-coord and detail toggles
     */
    _keyPress: function (e) {
        var key, character, vp = this.controller.viewport;
        
        // Letters use Event.which, while arrows, etc. use Event.keyCode
        if (e.keyCode)
            key = e.keyCode;
        else if (e.which)
            key = e.which;
        
        // Get character pressed (letters, etc)
        character = String.fromCharCode(key);

        // Arrow keys
        if (key === 37 || key === 38 || key === 39 || key === 40) {
            vp.startMoving();
            vp.viewportHandlers.moveCounter += 1; // Threshold
            //if ((vp.viewportHandlers.moveCounter % vp.viewportHandlers.imageUpdateThrottle) !== 0)
            //    return;
            vp.viewportHandlers.moveCounter = vp.viewportHandlers.moveCounter % vp.viewportHandlers.tileUpdateThrottle;
            
            //Right-arrow
            if (key === 37)
            	vp.moveBy(8, 0);
            	
            //Up-arrow
            else if (key === 38)
            	vp.moveBy(0, 8);
            	
            //Left-arrow
            else if (key === 39)
            	vp.moveBy(-8, 0);
            	
            //Down-arrow
            else if (key === 40)
            	vp.moveBy(0, -8);
            
            vp.endMoving();
            return false;
        }        

        else if (character === "c")
            $("#center-button").click();
        else if (character === "m")
            vp.viewportHandlers.toggleMouseCoords();
        else if (character === "-" || character === "_")
            $("#zoomControlZoomOut").click();
        else if (character === "=" || character === "+")
        	$("#zoomControlZoomIn").click();
        else if (character === "d")
            this.controller.eventLayers.toggleLabels();
        else if (character === "f")
            $("#fullscreen-btn").click();
        else if (character === ",")
            $("#timeBackBtn").click();        
        else if (character === ".")
        	$("#timeForwardBtn").click();
    }
});