/* @flow */
/* eslint-disable comma-dangle */
/* eslint-disable no-undefined */
/* eslint-disable operator-linebreak */

import React from 'react';

import HeaderBackButton from 'react-navigation/lib-rn/views/HeaderBackButton';

import { Platform } from 'react-native';

import {
  Icon,
  Button,
  Text,
} from 'native-base';

class CustomBackButton extends HeaderBackButton {
  render() {
    const { onPress, width, title, truncatedTitle } = this.props;

    const renderTruncated = this.state.initialTextWidth && width
      ? this.state.initialTextWidth > width
      : false;

    return (
      <Button
        transparent
        onPress={onPress}
      >
        <Icon name='arrow-back' />
        {Platform.OS === 'ios' && title && (
          <Text
            onLayout={this._onTextLayout}
            numberOfLines={1}
          >
            {renderTruncated ? truncatedTitle : title}
          </Text>
        )}
      </Button>
    );
  }
}

export default CustomBackButton;
