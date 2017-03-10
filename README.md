# react-navigation-native-base

NativeBase Header component for react-navigation

## Requirements
* [react-navigation](https://reactnavigation.org/docs/intro/)
* [NativeBase](http://nativebase.io/docs/v2.0.0/getting-started)

## Setup

```
yarn add react-navigation-native-base
```

```
import { Header } from 'react-navigation-native-base';

...

const AppNavigator = StackNavigator({
  // RouteConfigs
}, {
  headerComponent: Header
});
```

## Extra navigationOptions

* `header` - a config object for the header bar:

  * `props` - Props that will be passed to the NativeBase `<Header>` component

  * `left` - Left header component, automatically wrapped in `<Left>`

  * `right` - Right header component, automatically wrapped in `<Right>`

  * `title` - Title header component, Strings are automatically wrapped in
    `<Body><Title></Title></Body>`, React elements rendered as-is. (TODO)

  * `backButton` - Use custom back button component

## Custom back button

Custom back button component can be passed as
`navigationOptions.header.backButton`.

Component is not rendered if navigating further back is not possible.

The component will receive the following props:

* onPress - Triggers navigate back
* title - Title of back button (useful especially in iOS)
* width - Desired max width of component

## Examples

### Hide header drop-shadow when nested TabNavigator visible

```
TabNavigator.navigationOptions = {
  header: {
    style: {
      elevation: 0 // disable elevation when TabNavigator visible
    }
  }
};
```

### Screen with search bar in header (TODO)

```
import { Item, Input, Icon } from 'native-base';

...

class MyView extends Component {
  ...

  static navigationOptions = {
    header: {
      props: {
        searchBar: true,
        rounded: true
      },
      right: null, // don't draw a <Right/> element in the header
      title: (
        <Item>
          <Icon name='search' />
          <Input placeholder='Search' />
          <Icon active name='people' />
        </Item>
      )
    }
  }

  ...
}

```
