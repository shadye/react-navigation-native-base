/* @flow */

import React from 'react';

import { Title } from 'native-base';

const HeaderTitle = ({ ...rest }) => (
  <Title numberOfLines={1} {...rest} />
);

export default HeaderTitle;
