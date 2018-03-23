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
            onChangePage={this.changePage}
            currentPage={currentPage}
            minPage={3}
		/>
	);
}
```

### Props

* [View props...](view.md#props)

- [`initialPage`](viewpagerandroid.md#initialpage)
- [`onPageScroll`](viewpagerandroid.md#onpagescroll)
- [`onPageScrollStateChanged`](viewpagerandroid.md#onpagescrollstatechanged)
- [`onPageSelected`](viewpagerandroid.md#onpageselected)
- [`scrollEnabled`](viewpagerandroid.md#scrollenabled)

### Type Definitions

* [`ViewPagerScrollState`](viewpagerandroid.md#viewpagerscrollstate)

---

# Reference

## Props

### `currentPage`

Index of initial page that should be selected. Use `setPage` method to update the page, and `onPageSelected` to monitor page changes

| Type	 | Required |
| ------ | -------- |
| number | No	    |

---

### `onPageScroll`

Executed when transitioning between pages (ether because of animation for the requested page change or when user is swiping/dragging between pages) The `event` object for this callback will carry following data:

* position - index of first page from the left that is currently visible
* offset - value from range [0,1) describing stage between page transitions. Value x means that (1 - x) fraction of the page at "position" index is visible, and x fraction of the next page is visible.

| Type		 | Required |
| -------- | -------- |
| function | No			 |

---

### `onPageScrollStateChanged`

Function called when the page scrolling state has changed. The page scrolling state can be in 3 states:

* idle, meaning there is no interaction with the page scroller happening at the time
* dragging, meaning there is currently an interaction with the page scroller
* settling, meaning that there was an interaction with the page scroller, and the scroller is now finishing it's animation

| Type		 | Required |
| -------- | -------- |
| function | No			 |

---

### `onPageSelected`

This callback will be called once ViewPager finish navigating to selected page (when user swipes between pages). The `event.nativeEvent` object passed to this callback will have following fields:

* position - index of page that has been selected

| Type		 | Required |
| -------- | -------- |
| function | No			 |

### `scrollEnabled`

When false, the content does not scroll. The default value is true.

| Type | Required |
| ---- | -------- |
| bool | No			 |