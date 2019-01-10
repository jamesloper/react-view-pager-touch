A ViewPager-like React Component that has perfect kinetic scrolling, scroll locking, and bounce just like its native counterpart, coded in the smallest possible way.

`npm install --save react-view-pager-touch`

## Examples

```javascript
import ViewPager from 'react-view-pager-touch';

<ViewPager
    items={dates}
    renderItem={renderCalendar}
    onChangePage={this.changePage}
    currentPage={currentPage}
    minPage={3}
    onDragStart={() => console.log('started dragging')}
/>
```

Here is an implementation involving two stacked view-pagers to recreate the well known calendar interface in iOS. Of course the grey overflow indicators only appear on Android, and on iOS there is the well known elasticity effect. (ex: https://www.hux.com)


![iOS Calendar in React](https://media.giphy.com/media/3eTPYYpf6i9Rx94nkU/giphy.gif)


## Some CSS Required
You may wish to configure the CSS in your own project. Use this as a starting point to customize for your use case.

```css
.view-pager {overflow:hidden; position:relative; width:100%;}
.view-pager-canvas {white-space:nowrap; width:100%; overflow:visible; backface-visibility:hidden; transform-style:flat;}
.view-pager-view {width:100%; display:inline-block}
```

## Props

`items` - An array of items that will become your pages.

`renderItem` - A function that returns a React component that renders the page.

`currentPage` - Index of the page that should be selected.

`minPage` - Disallow scrolling to pages that come before this page.

`onPageSelected` - Function called once ViewPager finishes settling to selected page. The `event` object passed to this callback will have following fields:

* `position` - index of page that has been selected
* `offset` - the new page index minus the old page index (eg. 0 if the page stayed the same, 1 for flick, 2+ for multiple fast flicks)
* `item` - the item that is now visible on screen

`onDragStart` - Use this to detect when the view pager has locked to horizontal mode. For example, when you begin scrolling you may want to deselect any touched elements.

`lazy` - If true, does not render pages that are not the `currentPage`

## Changes
- 1.0.3: fixed scroll locking
- 1.1.0: enhanced support for mouse events
- 1.2.0: added support for lazy and resizing on the fly
- 1.2.1: bug fix for server side rendering and update devDependencies 

## Tested in BrowserStack
<a href="https://www.browserstack.com/" target="_blank">
    <img src="https://cdn.hux.com/readme-images/browserstack.png" height="60"/>
</a>
