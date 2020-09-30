import styled from 'styled-components/native';
import { FlatList } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

import { Provider } from './index';

export const Container = styled.View`
  flex: 1;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  padding: 24px;

  background: #28262e;
`;

export const HeaderText = styled.Text`
  font-family: 'RobotoSlab-Regular';
  font-size: 20px;
  line-height: 28px;

  color: #999591;
`;

export const HeaderUserName = styled.Text`
  font-family: 'RobotoSlab-Medium';

  color: #ff9900;
`;

export const ProfileButton = styled.TouchableOpacity``;

export const HeaderUserAvatar = styled.Image`
  width: 56px;
  height: 56px;

  border-radius: 28px;
`;

export const Content = styled.SafeAreaView`
  padding: 32px 24px;
`;

export const ProvidersTitle = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 25px;

  color: #f4ede8;

  margin-bottom: 24px;
`;

export const ProvidersList = styled(FlatList as new () => FlatList<Provider>)``;

export const ProviderItem = styled(RectButton)`
  flex-direction: row;
  align-items: center;

  padding: 20px 16px;
  margin-bottom: 16px;

  border-radius: 10px;

  background: #3e3b47;
`;

export const ProviderAvatar = styled.Image`
  width: 72px;
  height: 72px;

  border: 0;
  border-radius: 36px;

  margin-right: 20px;
`;

export const ProviderInfo = styled.View``;

export const ProviderName = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 18px;

  color: #f4ede8;

  margin-bottom: 6px;
`;

export const ProviderDateTime = styled.View`
  flex-direction: row;
  align-items: center;

  margin-top: 6px;
`;

export const ProviderDateTimeText = styled.Text`
  font-family: 'RobotoSlab-Regular';
  font-size: 12px;

  color: #999591;

  margin-left: 12px;
`;
