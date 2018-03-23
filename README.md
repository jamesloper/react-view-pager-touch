A ViewPager-like React Component that has perfect kinetic scrolling, scroll locking, and bounce just like its native counterpart.

ViewPager is a controlled component

```javascript
import ViewPager from 'react-view-pager-touch';

<ViewPager
    items={dates}
    renderItem={renderCalendar}
    onChangePage={this.changePage}
    currentPage={currentPage}
    minPage={3}
/>
```

You'll want to include this CSS in your styles file, or it won't work properly.
```css
.viewpager {overflow:hidden; position:relative; width:100%;}
.viewpager-canvas {white-space:nowrap; width:100%; overflow:visible; backface-visibility:hidden; transform-style:flat;}
.viewpager-view {width:100%; display:inline-block}
```


ViewPager enables dragging and flicking left and right between items:

```
render() {
    return (
        <ViewPager
            items={dates}
            renderItem={renderCalendar}
            currentPage={currentPage}
            minPage={3}
            onPageSelected={this.changePage}
        />
    );
}
```

## Props

### `items`

An array of items that will become your pages.

---

### `renderItem`

A function that returns a React component that renders the page.

---

### `currentPage`

Index of the page that should be selected.

---

### `minPage`

Will not allow scrolling to pages that come before this page.

---

### `onPageScrollStateChanged`

Function called when the page scrolling state has changed. The page scrolling state can be in 3 states:

* `idle` - meaning there is no interaction with the page scroller happening at the time
* `dragging` - meaning there is currently an interaction with the page scroller
* `settling` - meaning that there was an interaction with the page scroller, and the scroller is now finishing it's animation

---

### `onPageSelected`

This callback will be called once ViewPager finish navigating to selected page (when user swipes between pages). The `event` object passed to this callback will have following fields:

* `position` - index of page that has been selected
* `offset` - the new page index minus the old page index (eg. 0 if the page stayed the same, 1 for flick, 2+ for multiple fast flicks)
* `item` - the item that is now visible on screen

### `scrollEnabled`

When false, the content will not respond to touch. The default value is true.