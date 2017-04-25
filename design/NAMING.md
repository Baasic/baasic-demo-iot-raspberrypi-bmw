# CSS class naming convention

Modules are project wide reusable single (in most cases) HTML tag elements such as 
buttons, inputs or anchors.

## Tools
tools.typomatic
tools.bubba

## Modules
modules.container // Site container
modules.anchor // Anchors
modules.btn // Buttons
modules.input // Input fields

## Components

  Components consist of a couple of elements (usually HTML elements)
  combined to work as a whole (site header is a good example)

components.nav // Site navigation
components.header // Site header
components.footer // Site footer
components.smm // Social media links

## Utils

  Utils are project wide reusable utilities for handling various things
  such as floats, grids etc.

util.grid
util.floats

## CSS declaration order

	.selector {
    /* Positioning */
    position: absolute;
    z-index: 10;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    /* Display & Box Model */
    display: inline-block;
    overflow: hidden;
    box-sizing: border-box;
    width: 100px;
    height: 100px;
    padding: 10px;
    border: 10px solid #333;
    margin: 10px;
	
    /* Typography */
	@mixin type-scale $type-base, 1;
	font-weight: bold;
	letter-spacing: 1.5px;
	text-transform: uppercase;
    
    /* Other */
    background: #000;
    color: #fff;
    font-family: sans-serif;
    font-size: 16px;
   
