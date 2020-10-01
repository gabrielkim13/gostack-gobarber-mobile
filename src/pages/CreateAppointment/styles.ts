import styled from 'styled-components/native';
import { FlatList } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

import { Provider, Time } from './index';

interface SelectableListItemProps {
  disabled?: boolean;
  selected?: boolean;
}

export const Container = styled.View`
  flex: 1;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  background: #28262e;

  padding: 24px;
`;

export const BackButton = styled.TouchableOpacity`
  margin-right: auto;
`;

export const HeaderTitle = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 20px;

  color: #f4ede8;
`;

export const UserAvatar = styled.Image`
  width: 56px;
  height: 56px;

  border-radius: 28px;

  margin-left: auto;
`;

export const ProvidersListContainer = styled.SafeAreaView`
  margin: 32px 24px;
`;

export const ProvidersList = styled(FlatList as new () => FlatList<Provider>)``;

export const ProviderItem = styled(RectButton)<SelectableListItemProps>`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  border-radius: 10px;

  background: ${props => (props.selected ? '#ff9900' : '#3e3b47')};

  padding: 8px 12px;
  margin-right: 16px;
`;

export const ProviderAvatar = styled.Image`
  width: 32px;
  height: 32px;

  border-radius: 16px;

  margin-right: 8px;
`;

export const ProviderName = styled.Text<SelectableListItemProps>`
  font-family: 'RobotoSlab-Medium';
  font-size: 14px;

  color: ${props => (props.selected ? '#232129' : '#f4ede8')};
`;

export const Calendar = styled.View`
  padding: 8px 24px;
`;

export const CalendarText = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 25px;

  color: #f4ede8;
`;

export const CalendarButton = styled(RectButton)`
  align-items: center;
  justify-content: center;

  height: 48px;

  border-radius: 10px;

  margin-top: 16px;

  background: #ff9900;
`;

export const CalendarButtonText = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 16px;

  color: #232129;
`;

export const TimeContainer = styled.View`
  padding: 24px;
`;

export const TimeTitle = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 25px;

  color: #f4ede8;
`;

export const TimePeriod = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 14px;

  color: #999591;

  margin-top: 16px;
  margin-bottom: 8px;
`;

export const TimeList = styled(FlatList as new () => FlatList<Time>)``;

export const TimeItem = styled(RectButton)<SelectableListItemProps>`
  padding: 12px;
  margin-right: 8px;

  border-radius: 10px;

  background: ${props => (props.selected ? '#ff9900' : '#3e3b47')};
  opacity: ${props => (props.disabled ? '0.3' : '1.0')};
`;

export const TimeText = styled.Text<SelectableListItemProps>`
  font-family: 'RobotoSlab-Medium';
  font-size: 14px;

  color: ${props => (props.selected ? '#232129' : '#f4ede8')};
`;

export const CreateAppointmentButton = styled(RectButton)`
  align-items: center;
  justify-content: center;

  height: 48px;

  border-radius: 10px;

  margin: 16px 24px;

  background: #ff9900;
`;

export const CreateAppointmentText = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 16px;

  color: #232129;
`;
