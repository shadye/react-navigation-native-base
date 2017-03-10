# react-navigation-native-base

NativeBase Header component for react-navigation

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

  * `left` - Left header component, automatically wrapped in `<Left>` component.
    Pass `null` to disable

  * `right` - Right header component, automatically wrapped in `<Right>`
    component. Pass `null` to disable

  * `title` - Title header component, Strings are automatically wrapped in
    `<Body><Title></Title></Body>`, React elements rendered as-is.

```

## Example

Example screen that renders a search bar in the header:

```
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
