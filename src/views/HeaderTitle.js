/* @flow */

import React from 'react';

import { Title, Text } from 'native-base';

const HeaderTitle = ({ ...rest }) => (
  <Title>
    <Text numberOfLines={1} {...rest} />
  </Title>
);

export default HeaderTitle;
