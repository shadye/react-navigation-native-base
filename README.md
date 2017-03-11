# react-navigation-native-base

NativeBase Header component for react-navigation

## Requirements
* [react-navigation](https://reactnavigation.org/docs/intro/)
* [NativeBase](http://nativebase.io/docs/v2.0.0/getting-started)

## Setup

```
yarn add react-navigation-native-base
```

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

## Implementation

Modifications to react-navigation code are kept to a minimum. As a result, the
component structure is very similar to what is used in the vanilla
react-navigation header, and code is easier to maintain when updates occur.

### Component tree

The React component tree looks roughly like:
```
<Animated.View>     // Animated container for entire header
  <Header>          // Visible NativeBase header, think of it as the "background"
    [               // Array of all screens, nearby ones are rendered
      <View>        // <View> stickying header contents to top of screen
        <Header>    // Invisible NativeBase header, container for contents
          <Left/>   // Example contents of header
          <Body/>
          <Right/>
          ...
        </Header>
      </View>
    ]
  <Header>
</Animated.View>
```

## New optional navigationOptions

By default the Header acts just like the vanilla react-navigation header, but
with the look and feel of a NativeBase `<Header>` component. You can customize
the behavior by passing parameters from the following list:

* `header`

  * `props` - Props that will be passed to the visible NativeBase `<Header>`
    component, shared between screens

  * `containerProps` - Props that will be passed to the invisible NativeBase
    `<Header>` component, unique for each screen.

  * `left` - Left header component, wrapped in `<Left>` by default

  * `right` - Right header component, wrapped in `<Right>` by default

  * `title` - Title header component, wrapped in `<Body>` by default

  * `children` - Replace all default child components with custom component(s)
    (more info below)

  * `backButton` - Use custom back button component (more info below)

## Custom Header child components

By default, react-navigation `left`, `right`, `title` components are used.
These are automatically wrapped in respective `<Left>`, `<Right>`, `<Body>`
NativeBase components.

This behavior can be overridden by passing a function to
`navigationOptions.header.children`.

The function will receive the following props:

* `left`: `left` component as provided by react-navigation
* `right`: `right` component as provided by react-navigation
* `title`: `title` component as provided by react-navigation
* `scene`: Current react-navigation scene
* `navigationState`: Current react-navigation navigationState
* `onNavigateBack`: Function which triggers back navigation

Expected return value is a React component or an array of React components.

## Custom back button

Custom back button component can be passed as
`navigationOptions.header.backButton`.

Component is only rendered if navigating back is possible (react-navigation
decides).

The component will receive the following props:

* `onPress` - Triggers navigate back
* `title` - Title of back button (useful especially in iOS)
* `width` - Desired max width of component

Expected return value is a React component.

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

### Screen with search bar in header

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
      children: (props) => (
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
