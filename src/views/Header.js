/* @flow */

import React from 'react';

import { View, StyleSheet, Animated, Platform } from 'react-native';

import { Header, Left, Right, Body } from 'native-base';

import ReactNavigationHeader from 'react-navigation/src/views/Header';
import addNavigationHelpers from 'react-navigation/src/addNavigationHelpers';
import NavigationPropTypes from 'react-navigation/src/PropTypes';
import HeaderStyleInterpolator from 'react-navigation/src/views/HeaderStyleInterpolator';

import type {
  NavigationScene,
  NavigationSceneRendererProps,
  LayoutEvent,
} from 'react-navigation/src/TypeDefinition';

type SubViewProps = NavigationSceneRendererProps & {
  onNavigateBack?: () => void,
};

// NativeBase patched header sub-components
import HeaderTitle from './HeaderTitle';
import HeaderBackButton from './HeaderBackButton';

class CustomNavigationHeader extends ReactNavigationHeader {
  // Custom _renderTitleComponent() which uses NativeBase patched <HeaderTitle>
  _renderTitleComponent = (props: SubViewProps) => {
    const title = this._getHeaderTitle(props.navigation);

    // On iOS, width of left/right components depends on the calculated
    // size of the title.
    const onLayoutIOS = Platform.OS === 'ios'
    ? (e: LayoutEvent) => {
      this.setState({
        widths: {
          ...this.state.widths,
          [props.key]: e.nativeEvent.layout.width,
        },
      });
    }
    : undefined;

    return (
      <HeaderTitle
        onLayout={onLayoutIOS}
      >
        {title}
      </HeaderTitle>
    );
  };

  // Custom _renderLeftComponent() which uses NativeBase patched <HeaderBackButton>
  // Supports passing a custom back button as navigationOptions.header.backButton
  _renderLeftComponent = (props: SubViewProps) => {
    if (props.scene.index === 0 || !props.onNavigateBack) {
      return null;
    }
    const tintColor = this._getHeaderTintColor(props.navigation);
    const previousNavigation = addNavigationHelpers({
      ...props.navigation,
      state: props.scenes[props.scene.index - 1].route,
    });
    const backButtonTitle = this._getBackButtonTitle(previousNavigation);
    const width = this.state.widths[props.key]
      ? (props.layout.initWidth - this.state.widths[props.key]) / 2
      : undefined;

    const header = this.props.router.getScreenConfig(props.navigation, 'header');
    const CustomBackButton = header && header.backButton;

    if (CustomBackButton) {
      return (
        <CustomBackButton
          onPress={props.onNavigateBack}
          tintColor={tintColor}
          title={backButtonTitle}
          width={width}
        />
      );
    }

    return (
      <HeaderBackButton
        onPress={props.onNavigateBack}
        tintColor={tintColor}
        title={backButtonTitle}
        width={width}
        transparent
      />
    );
  };

  _renderLeft(props: NavigationSceneRendererProps): ?React.Element<*> {
    return this._renderSubView(
      props,
      'left_nativebase',
      this.props.renderLeftComponent,
      this._renderLeftComponent,
      HeaderStyleInterpolator.forLeft,
    );
  }

  _renderTitle(props: NavigationSceneRendererProps, options: *): ?React.Element<*> {
    const style = {};

    if (Platform.OS === 'android') {
      if (!options.hasLeftComponent) {
        style.left = 0;
      }
      if (!options.hasRightComponent) {
        style.right = 0;
      }
    }

    return this._renderSubView(
      { ...props, style },
      'title_nativebase',
      this.props.renderTitleComponent,
      this._renderTitleComponent,
      HeaderStyleInterpolator.forCenter,
    );
  }

  _renderRight(props: NavigationSceneRendererProps): ?React.Element<*> {
    return this._renderSubView(
      props,
      'right_nativebase',
      this.props.renderRightComponent,
      this._renderRightComponent,
      HeaderStyleInterpolator.forRight,
    );
  }

  // Custom _renderHeader() which renders children inside an invisible NativeBase <Header>
  _renderHeader(props: NavigationSceneRendererProps): React.Element<*> {
    const header = this.props.router.getScreenConfig(this.props.navigation, 'header');
    const containerProps = header ? header.containerProps : {};

    const left = this._renderLeft(props);
    const right = this._renderRight(props);

    const title = this._renderTitle(props, {
      hasLeftComponent: !!left,
      hasRightComponent: !!right,
    });

    let headerChildren = header && header.children;

    if (!headerChildren) {
      headerChildren = (childProps) => ([
        <Left key='left'>{childProps.left}</Left>,
        <Body key='body'>{childProps.title}</Body>,
        <Right key='right'>{childProps.right}</Right>,
      ])
    }

    return (
      <View
        style={StyleSheet.absoluteFill}
        key={`scene_${props.scene.key}`}
      >
        <Header style={styles.header} {...containerProps}>
          {headerChildren({
            left,
            right,
            title,
            scene: props.scene,
            navigationState: props.navigationState,
            onNavigateBack: this.props.onNavigateBack,
          })}
        </Header>
      </View>
    );
  }

  // Custom render() which renders a NativeBase <Header>
  render() {
    let appBar;

    if (this.props.mode === 'float') {
      const scenesProps: Array<NavigationSceneRendererProps> = this.props.scenes
        .map((scene: NavigationScene, index: number) => ({
          ...NavigationPropTypes.extractSceneRendererProps(this.props),
          scene,
          index,
          navigation: addNavigationHelpers({
            ...this.props.navigation,
            state: scene.route,
          }),
        }));

      appBar = scenesProps.map(this._renderHeader, this);
    } else {
      appBar = this._renderHeader({
        ...NavigationPropTypes.extractSceneRendererProps(this.props),
        position: new Animated.Value(this.props.scene.index),
        progress: new Animated.Value(0),
      });
    }

    // eslint-disable-next-line no-unused-vars
    const { scenes, scene, style, position, progress, ...rest } = this.props;

    const header = this.props.router.getScreenConfig(this.props.navigation, 'header');
    const headerProps = header ? header.props : {};

    return (
      <Animated.View {...rest} style={style}>
        <Header {...headerProps}>
          {appBar}
        </Header>
      </Animated.View>
    );
  }
}

const styles = {
  header: {
    backgroundColor: 'transparent',
    elevation: 0,
  },
};

export default CustomNavigationHeader;
