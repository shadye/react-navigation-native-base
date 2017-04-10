/* @flow */

import React, { PureComponent } from 'react';
import {
  Animated,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
} from 'react-native';
import TabBarIcon from './TabBarIcon';

import variable from 'native-base/dist/src/theme/variables/platform';
import { Footer, FooterTab, Button, Icon } from 'native-base';

import type {
  NavigationRoute,
  NavigationState,
  Style,
} from 'react-navigation/src/TypeDefinition';

import type {
  TabScene,
} from 'react-navigation/src/views/TabView';

type DefaultProps = {
  activeTintColor: string;
  activeBackgroundColor: string;
  inactiveTintColor: string;
  inactiveBackgroundColor: string;
  showLabel: boolean;
};

type Props = {
  activeTintColor: string;
  activeBackgroundColor: string;
  inactiveTintColor: string;
  inactiveBackgroundColor: string;
  position: Animated.Value;
  navigationState: NavigationState;
  jumpToIndex: (index: number) => void;
  getLabel: (scene: TabScene) => ?(React.Element<*> | string);
  renderIcon: (scene: TabScene) => React.Element<*>;
  showLabel: boolean;
  style?: Style;
  labelStyle?: Style;
  showIcon: boolean;
};

// TODO: this breaks with NativeBase <Text> components
AnimatedText = Animated.createAnimatedComponent(Text);

export default class TabBarBottom extends PureComponent<DefaultProps, Props, void> {

  // See https://developer.apple.com/library/content/documentation/UserExperience/Conceptual/UIKitUICatalog/UITabBar.html
  static defaultProps = {
    activeTintColor: '#3478f6', // Default active tint color in iOS 10
    activeBackgroundColor: 'transparent',
    inactiveTintColor: '#929292', // Default inactive tint color in iOS 10
    inactiveBackgroundColor: 'transparent',
    showLabel: true,
    showIcon: true,
  };

  props: Props;

  _renderLabel = (scene: TabScene) => {
    const {
      position,
      navigationState,
      activeTintColor,
      inactiveTintColor,
      labelStyle,
      showLabel,
    } = this.props;
    if (showLabel === false) {
      return null;
    }

    const variables = (this.context.theme) ? this.context.theme['@@shoutem.theme/themeStyle'].variables : variable;

    const { index } = scene;
    const { routes } = navigationState;
    // Prepend '-1', so there are always at least 2 items in inputRange
    const inputRange = [-1, ...routes.map((x: *, i: number) => i)];
    const outputRange = inputRange.map((inputIndex: number) =>
      (inputIndex === index ? variables.tabBarActiveTextColor : variables.tabBarTextColor)
    );
    const color = position.interpolate({
      inputRange,
      outputRange,
    });

    const label = this.props.getLabel(scene);
    if (typeof label === 'string') {
      return (
        <AnimatedText style={{...labelStyle, color}}>
          {label}
        </AnimatedText>
      );
    }
    if (typeof label === 'function') {
      return label(scene);
    }

    return label;
  };

  _renderIcon = (scene: TabScene) => {
    const {
      position,
      navigationState,
      activeTintColor,
      inactiveTintColor,
      renderIcon,
      showIcon,
    } = this.props;
    if (showIcon === false) {
      return null;
    }
    return (
      <TabBarIcon
        position={position}
        navigationState={navigationState}
        activeTintColor={activeTintColor}
        inactiveTintColor={inactiveTintColor}
        renderIcon={renderIcon}
        scene={scene}
        style={styles.icon}
      />
    );
  };

  render() {
    const {
      position,
      navigationState,
      jumpToIndex,
      activeBackgroundColor,
      inactiveBackgroundColor,
      style,
    } = this.props;
    const { routes } = navigationState;
    // Prepend '-1', so there are always at least 2 items in inputRange
    const inputRange = [-1, ...routes.map((x: *, i: number) => i)];
    return (
      <Footer>
        <FooterTab>
          {navigationState.routes.map((route: NavigationRoute, index: number) => {
            const focused = index === navigationState.index;
            const scene = { route, index, focused };
            const outputRange = inputRange.map((inputIndex: number) =>
              (inputIndex === index ? activeBackgroundColor : inactiveBackgroundColor)
            );
            const backgroundColor = position.interpolate({
              inputRange,
              outputRange,
            });
            const justifyContent = this.props.showIcon ? 'flex-end' : 'center';

            // TODO Animate button background
            // <Animated.View style={[styles.tab, { backgroundColor, justifyContent }]}>
            return (
              <Button transparent key={route.key} onPress={() => jumpToIndex(index)}>
                {this._renderIcon(scene)}
                {this._renderLabel(scene)}
              </Button>
            );
          })}
        </FooterTab>
      </Footer>
    );
  }
}

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-end',
  },
  icon: {
    flexGrow: 1,
  },
});
