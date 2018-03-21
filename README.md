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