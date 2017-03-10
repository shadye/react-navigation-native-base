/* @flow */

import React, {
  PropTypes,
} from 'react';

import {
  Animated,
  Platform,
  StyleSheet,
  View,
} from 'react-native';

import {
  Container,
  Header as NBHeader,
  Title,
  Left,
  Right,
  Body,
} from 'native-base';

import HeaderTitle from 'react-navigation/lib/views/HeaderTitle';
import HeaderStyleInterpolator from 'react-navigation/lib/views/HeaderStyleInterpolator';
import NavigationPropTypes from 'react-navigation/lib/PropTypes';
import addNavigationHelpers from 'react-navigation/lib/addNavigationHelpers';

import type {
  NavigationScene,
  NavigationRouter,
  NavigationAction,
  NavigationScreenProp,
  NavigationSceneRendererProps,
  // NavigationStyleInterpolator,
  Style,
} from 'react-navigation/lib/TypeDefinition';

import HeaderBackButton from './HeaderBackButton';

export type HeaderMode = 'float' | 'screen' | 'none';

type SubViewProps = NavigationSceneRendererProps & {
  onNavigateBack?: () => void,
};

type Navigation = NavigationScreenProp<*, NavigationAction>;

type SubViewRenderer = (subViewProps: SubViewProps) => ?React.Element<any>;

export type HeaderProps = NavigationSceneRendererProps & {
  mode: HeaderMode,
  onNavigateBack?: () => void,
  renderLeftComponent: SubViewRenderer,
  renderRightComponent: SubViewRenderer,
  tintColor?: string,
  router: NavigationRouter,
};

type SubViewName = 'left' | 'title' | 'right';

type HeaderState = {
  widths: {
    [key: string]: number,
  },
};

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;
const TITLE_OFFSET = Platform.OS === 'ios' ? 70 : 40;

class Header extends React.PureComponent<void, HeaderProps, HeaderState> {

  static HEIGHT = APPBAR_HEIGHT + STATUSBAR_HEIGHT;
  static Title = HeaderTitle;
  static BackButton = HeaderBackButton;

  // propTypes for people who don't use Flow
  static propTypes = {
    ...NavigationPropTypes.SceneRendererProps,
    onNavigateBack: PropTypes.func,
    renderLeftComponent: PropTypes.func,
    renderRightComponent: PropTypes.func,
    router: PropTypes.object,
    style: PropTypes.any,
  };

  props: HeaderProps;

  state = {
    widths: {},
  };

  _getHeaderTitle(navigation: Navigation): ?string {
    const header = this.props.router.getScreenConfig(navigation, 'header');
    let title;
    if (header && header.title) {
      title = header.title;
    } else {
      title = this.props.router.getScreenConfig(navigation, 'title');
    }
    return typeof title === 'string' ? title : undefined;
  }

  _getBackButtonTitle(navigation: Navigation): ?string {
    const header = this.props.router.getScreenConfig(navigation, 'header') || {};
    if (header.backTitle === null) {
      return undefined;
    }
    return header.backTitle || this._getHeaderTitle(navigation);
  }

  _getHeaderTintColor(navigation: Navigation): ?string {
    const header = this.props.router.getScreenConfig(navigation, 'header');
    if (header && header.tintColor) {
      return header.tintColor;
    }
    return undefined;
  }

  _getHeaderTitleStyle(navigation: Navigation): Style {
    const header = this.props.router.getScreenConfig(navigation, 'header');
    if (header && header.titleStyle) {
      return header.titleStyle;
    }
    return undefined;
  }

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

    return (
      <HeaderBackButton
        onPress={props.onNavigateBack}
        tintColor={tintColor}
        title={backButtonTitle}
        width={width}
      />
    );
  };

  _renderRightComponent = () => null;

  _renderLeft(props: NavigationSceneRendererProps): ?React.Element<*> {
    return this._renderSubView(
      props,
      'left',
      this.props.renderLeftComponent,
      this._renderLeftComponent,
      HeaderStyleInterpolator.forLeft,
    );
  }

  _renderRight(props: NavigationSceneRendererProps): ?React.Element<*> {
    return this._renderSubView(
      props,
      'right',
      this.props.renderRightComponent,
      this._renderRightComponent,
      HeaderStyleInterpolator.forRight,
    );
  }

  _renderSubView(
    props: NavigationSceneRendererProps,
    name: SubViewName,
    renderer: SubViewRenderer,
    defaultRenderer: SubViewRenderer,
    // styleInterpolator: NavigationStyleInterpolator,
  ): ?React.Element<*> {
    const {
      scene,
      navigationState,
    } = props;
    const {
      index,
      // isStale,
      // key,
    } = scene;

    const offset = navigationState.index - index;

    if (Math.abs(offset) > 2) {
      // Scene is far away from the active scene. Hides it to avoid unnecessary
      // rendering.
      return null;
    }

    const subViewProps = {
      ...props,
      onNavigateBack: this.props.onNavigateBack,
    };

    let subView = renderer(subViewProps);
    if (subView === undefined) {
      subView = defaultRenderer(subViewProps);
    }

    if (subView === null) {
      return null;
    }

    // works
    return subView;

    // TODO
    /*
    const pointerEvents = offset !== 0 || isStale ? 'none' : 'box-none';

    const AnimatedSubView = Animated.createAnimatedComponent(subView);

    return (
      <AnimatedSubView
        pointerEvents={pointerEvents}
        key={`${name}_${key}`}
        style={[
          styles.item,
          styles[name],
          props.style,
          styleInterpolator(props)
        ]}
      />
    );
    */
  }

  _renderHeader(props: NavigationSceneRendererProps): React.Element<*> {
    const header = this.props.router.getScreenConfig(props.navigation, 'header');
    const headerProps = header ? header.props : {};
    const leftProps = header ? header.leftProps : {};
    const rightProps = header ? header.rightProps : {};
    const bodyProps = header ? header.bodyProps : {};
    const titleProps = header ? header.titleProps : {};

    let left = <Left {...leftProps}>{this._renderLeft(props)}</Left>;
    if (header.left === null) {
      left = null;
    }

    let right = <Right {...rightProps}>{this._renderRight(props)}</Right>;
    if (header.right === null) {
      right = null;
    }

    let title = this._getHeaderTitle(props.navigation);
    if (title) {
      title = (
        <Body {...bodyProps}>
          <Title {...titleProps}>
            {title}
          </Title>
        </Body>
      );
    } else {
      title = header.title;
    }

    return (
      <Container>
        <NBHeader
          key={`scene_${props.scene.key}`}
          {...headerProps}
        >
          {left}
          {title}
          {right}
        </NBHeader>
      </Container>
    );
  }

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

    /* eslint-disable no-unused-vars */
    const {
      scenes,
      scene,
      style,
      position,
      progress,
      ...rest
    } = this.props;
    /* eslint-enable no-unused-vars */

    return (
      <Animated.View {...rest} style={[styles.container, style]}>
        <View style={styles.appBar}>
          {appBar}
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: STATUSBAR_HEIGHT,
    backgroundColor: Platform.OS === 'ios' ? '#EFEFF2' : '#FFF',
    height: STATUSBAR_HEIGHT + APPBAR_HEIGHT,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: StyleSheet.hairlineWidth,
    shadowOffset: {
      height: StyleSheet.hairlineWidth,
    },
    elevation: 4,
  },
  appBar: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  title: {
    bottom: 0,
    left: TITLE_OFFSET,
    right: TITLE_OFFSET,
    top: 0,
    position: 'absolute',
    alignItems: Platform.OS === 'android'
      ? 'flex-start'
      : 'center',
  },
  left: {
    left: 0,
    bottom: 0,
    top: 0,
    position: 'absolute',
  },
  right: {
    right: 0,
    bottom: 0,
    top: 0,
    position: 'absolute',
  },
});

export default Header;
