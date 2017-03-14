# react-navigation-native-base

NativeBase components for react-navigation

Implemented component shims:

* `<Header>`
* `<FooterTab>`

Coming soon™: `<Tabs>` and `<Drawer>` shims.

## Requirements
* [react-navigation](https://reactnavigation.org/docs/intro/)
* [NativeBase](http://nativebase.io/docs/v2.0.0/getting-started)

## Setup

```
yarn add react-navigation-native-base
```

### Header

Add the custom headerComponent into your StackNavigatorConfig:

```
import { Header } from 'react-navigation-native-base';

...

const AppNavigator = StackNavigator({
  // RouteConfigs...
}, {
  headerComponent: Header
});
```

That's it! Now your react-navigation header will have the look and feel of a
NativeBase `<Header>`.

[Click here for Header documentation](/docs/header.md)

### Tabs

Add the custom tabBarComponent into your TabNavigatorConfig:

```
import { FooterTab } from 'react-navigation-native-base';

...

const TabScreenNavigator = TabNavigator({
  // RouteConfigs...
}, {
  tabBarComponent: FooterTab,
  tabBarPosition: 'bottom'
});
```

That's it! Now your react-navigation TabBar will have the look and feel of a
NativeBase `<FooterTab>` or `<Tabs>` (TODO).

[Click here for TabBar documentation](/docs/tabbar.md)
