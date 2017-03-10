/* @flow */

import React, {
  PropTypes,
} from 'react';

import {
  I18nManager,
  Platform,
} from 'react-native';

import {
  Icon,
  Button,
  Text,
} from 'native-base';

import type {
  LayoutEvent,
} from 'react-navigation/lib/TypeDefinition';

type Props = {
  onPress?: () => void,
  title?: ?string,
  truncatedTitle?: ?string,
  width?: ?number,
};

type DefaultProps = {
  truncatedTitle: ?string,
};

type State = {
  initialTextWidth?: number,
};

class HeaderBackButton extends React.PureComponent<DefaultProps, Props, State> {
  static propTypes = {
    onPress: PropTypes.func.isRequired,
    title: PropTypes.string,
    truncatedTitle: PropTypes.string,
    width: PropTypes.number,
  };

  static defaultProps = {
    truncatedTitle: 'Back',
  };

  state = {};

  _onTextLayout = (e: LayoutEvent) => {
    if (this.state.initialTextWidth) {
      return;
    }
    this.setState({
      initialTextWidth: e.nativeEvent.layout.x + e.nativeEvent.layout.width,
    });
  };

  render() {
    const {
      onPress,
      width,
      title,
      truncatedTitle,
    } = this.props;

    const renderTruncated = this.state.initialTextWidth && width
      ? this.state.initialTextWidth > width
      : false;

    let iconStyle = {
      ...styles.icon,
    };
    if (title) {
      iconStyle = {
        ...iconStyle,
        ...styles.iconWithTitle,
      };
    }

    return (
      <Button
        transparent
        onPress={onPress}
      >
        <Icon name="arrow-back" style={iconStyle} />
        {Platform.OS === 'ios' && title && (
          <Text
            onLayout={this._onTextLayout}
            style={styles.title}
            numberOfLines={1}
          >
            {renderTruncated ? truncatedTitle : title}
          </Text>
        )}
      </Button>
    );
  }
}

const styles = {
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 17,
    paddingRight: 10,
  },
  icon: Platform.OS === 'ios'
    ? {
      height: 20,
      width: 12,
      marginLeft: 10,
      marginRight: 22,
      marginVertical: 12,
      transform: [{
        scaleX: I18nManager.isRTL ? -1 : 1,
      }],
    }
    : {
      height: 24,
      width: 24,
      margin: 16,
      transform: [{
        scaleX: I18nManager.isRTL ? -1 : 1,
      }],
    },
  iconWithTitle: Platform.OS === 'ios'
    ? {
      marginRight: 5,
    }
    : {},
};

export default HeaderBackButton;
