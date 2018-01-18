# BootstrapAlerts
Dynamically create Bootstrap style alerts at run time.

## Introduction
I created BootstrapAlerts when working with AngularJS. I wanted a way to dynamically create alerts that would appear and vary in their information.

Early version involved writing HTML strings, parsing them, and then inserting them. You'd be right to look at me questioningly.  
I realised that I could not sustain this.

I began working on a simple class that I could create to make these alerts at runtime.  
My application would create a instance of the class and then set various options depending on AJAX requests.

## Usage
BootstrapAlerts is a completely standalone library.  
To include it in your site, add a script reference to the head of your document.

```HTML
<script src="/path/to/bootstrap-alerts.js"></script>
```

Once the file is referenced it is very simple to create these alerts.  
Below is a simple sample of code.

```JavaScript
var ba = new BootstrapAlert();
ba.setBackground('success'); // set the alert to a success one
ba.addH(1, 'Action was successful!'); // create a heading 1 tag
ba.addP('The action you just performed was completed successfully.');
document.getElementByTagName('body')[0].appendChild(ba.render());
```

The above will generate a Bootstrap alert and append it to the body of the document.

Despite the library not requiring jQuery, it can still be used in the jQuery selector by calling `render()` inside it.  
For example `$(ba.render())` would successfully create a jQuery instance of the alert.

### Options

In much the same way that jQuery options work; BootstrapAlerts accepts a JSON of options that it will overwrite the defaults with.  
Before I begin explaining all of the options, I'll include a simple demonstration.

```JavaScript
var ba = new BootstrapAlert({
    dismissible: true,
    background: 'primary'
});
```

#### `dismissible` <sub>[Boolean] Default: `false`</sub>
If set to true, this will add the &times; character to the top right corner of the alert allowing it to be closed and dismissed.

#### `fadeIn` <sub>[Boolean] Default: `true`</sub>
This will cause the alert to fade into view rather than just appearing on the screen. In addition, if dimissible is set to true and the alert is closed then this will also fade the alert out.

#### `destroyAfter` <sub>[Number] Default: `3000`</sub>
The time, in milliseconds, before the alert will be destroyed from the DOM.

**This requires that dimissible is set to true.**  
The reason for that choice is that I deemed it undesired behavious to destory and alert if it is unable to be deleted by the user.  
This way, the user can destroy the element themselves with the &times; button or after a period of time it will go itself.

#### `max` <sub>[Number] Default: `0`</sub>
A natural number that specifies the maximum number of alerts that can be produced.  
This is useful for when you want to create many alerts but not have too many on the screen.

Setting to 0 or below will disable this option.

**This requires maxId to be set to a string of length more than 1.**  
This is so that JavaScript knows which alerts it is destroying of that type / ID.

_Note: this is currently WIP_.  
The alerts deleted currently are those at the top of the DOM. That is, the alert at position `0` in the DOM (the highest alert in the DOM) will be deleted and **not** the oldest alert.

#### `maxId` <sub>[String] Default: `''`</sub>
An identifier for the alert.

Alerts can have many different IDs, and can even have the same ID.  
This is because it doesn't set the ID of the alert to this value, it will set the `data-max-id` to this value, allowing multiple alerts to share the same ID thus being able to have a `max` limit to restrict excessive alert usage.

#### `background` <sub>[String or Number] Default: `primary`</sub>
One of the following values:

1. primary
2. secondary
3. success
4. danger
5. warning
6. info
7. light
8. dark

_Note:_ The ordered list number values. The significance of these is that you can specify the number version for the background and that will select that background.  
_Post Note:_ If an invalid background is passed, the default value will be used instead.

#### `classes` <sub>[String or Array or Object] Default: `''`</sub>
For any extra classes that you want to apply to the alert.

This option can take multiple variable types, the below is how they are expected to be presented.

* `String`  
A space delimited string. That is, as if you were writing the class in the HTML.  
`'class1 class2 class3'`
* `Array`  
An array where each value in the array is a new class.  
`['class1', 'class2', 'class3']`
* `Object`  
An object where each value in the object is a new class.  
`{ 'class1', 'class2', 'class3' }`

### Functions

#### `isEmpty()`
##### Arguments
None.

##### Return `Boolean`  
True if no content has been added, false otherwise.

_Note:_ This is the content of the alert, **not** whether options have been set. This means that an alert could have its background changed, but as long as no text is set then it is empty.

#### `clear()`
This clears all content **not** the styling of the alert.
##### Arguments
None.

##### Return `Object`
All functions from this point on will assume that they return `this`, unless stated otherwise.  
This return value is to allow for chaining methods.

#### `setBackground(bg)`
##### Arguments
* `bg`  
This is the same as passing a background to the options object; except this is done at runtime.  
See the [`background`](#background-string-or-number-default-primary) option for more information.

#### `setBg(bg)`
Alias of `setBackground`.

#### `setHTML(str)`
##### Arguments
* `str`  
The String that will overwrite the current content of the alert.  
It is advised that you use one of the style functions below (such as `addP`) as this meant as a 'cover-all' solution for anything that you might want to do, but otherwise couldn't.  
_Note:_ This doesn't have to be HTML, but note that no validation is done to the string.

#### `addHTML(str)`
##### Arguments
* `str`  
Similar to the above function. Except that this appends the content with pure HTML.

#### `addParagraph(str[, classes])`
##### Arguments
* `str`  
Any information that will be wrapped in `<p>` tags.
* `classes` <sub>optional</sub>  
This can be used to give your paragraph any formatting such as `'m-0 mt-1'`.

#### `addP(str, classes)`
Alias of `addParagraph`.

#### `addLink(href[, text[, classes[, target[, title]]]])`
##### Arguments
* `href`  
The location that the anchor will point to.
* `text` <sub>optional</sub>  
The text to display for the anchor.  
If negated, `text` will default to `href`.
* `classes` <sub>optional</sub>  
Any extra classes to apply to the anchor, such as `text-primary`.
* `target` <sub>optional</sub>  
    One of:
    * `blank`: Opens the linked document in a new window.
    * `_self`: Opens the linked document in the same frame as it was clicked (this is default).
    * `_parent`: Opens the linked document in the parent frameset.
    * `_top`: Opens the linked document in the full body of the window.
    * `framename`: Opens the linked document in a named frame.
* `title` <sub>optional</sub>  
Text that will display on hover of the anchor.  
_Note:_ This does not create a popover.

#### `addA(href[, text[, classes[, target[, title]]]])`
Alias of `addLink`.

#### `addParaLink(href[, text[, classes[, target[, title]]]])`
Creates the same result as `addLink`, except the result is wrapped in `<p>` tags.
##### Arguments
See [`addLink`](#addlinkhref-text-classes-target-title).

#### `addPA(href[, text[, classes[, target[, title]]]])`
Alias of `addParaLink`.

#### `addHeading(level, str[, classes])`
##### Arguments
* `level`  
An integer ranging from 1 to 6.  
Any value below 1 is treated as 1, and any value above 6 is treated as 6. Additionally, any value that is not an integer is treated as 1.
* `str`  
The content of the heading.
* `classes` <sub>optional</sub>  
Any extra classes to apply to the anchor, such as `h3`.

#### `addH(level, str[, classes])`
Alias of `addHeading`.

#### `render()`
##### Arguments
None.

##### Return `Object`
Render will return an HTMLElement instance.

### Real world usage
You might be thinking "Why has this guy created this? Do we actually need this?".

To be honest, I'm not sure we _actually_ need it. I am a fledgling programmer and made this because it was something that I thought that I needed for my projects.

I was working in AngularJS and performing AJAX operations, I needed some way to notify the user of what had happened.  
A typical example of work might be.

```JavaScript
let ba = new BootstrapAlert({ dismissible: true });

$http.post('/path/to/api', { 'username': 'somePersonToInsert' })
.then(function(response) {
    if (response.data.success) {
        ba.setBackground('success');
        ba.addP('<b>Success!</b> That user was added successfully.');
    } else if (response.data.failed) {
        ba.setBackground('danger');
        ba.addP('<b>Failed!</b> That user was not added successfully.');
    }
}, function(response) {
    ba.setBackground('danger');
    ba.addP('<b>Failed!</b> Something unexpected happened.');
})
.then(function() {
    $(ba.render()).insertBefore($('#my-form'));
});
```

In the above example, data was sent to the server and then a Bootstrap alert was created to reflect the success of this action, before being inserted before the form.
