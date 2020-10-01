import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  justify-content: center;

  padding: 0 30px 40px;
`;

export const Header = styled.View`
  flex-direction: row;

  align-items: center;
  justify-content: space-between;

  margin-top: 36px;
`;

export const HeaderButton = styled.TouchableOpacity``;

export const HeaderText = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 20px;

  color: #f4ede8;
`;

export const UserAvatarButton = styled.TouchableOpacity``;

export const UserAvatarImage = styled.Image`
  align-self: center;

  width: 186px;
  height: 186px;

  border-radius: 93px;

  margin: 24px 0;
`;
