import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const Title = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 30px;

  text-align: center;

  color: #f4ede8;

  max-width: 200px;

  margin-top: 48px;
`;

export const Description = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 14px;

  text-align: center;

  color: #999591;

  max-width: 265px;

  margin-top: 16px;
`;

export const OkButton = styled(RectButton)`
  padding: 16px 40px;
  margin-top: 40px;

  border-radius: 10px;

  background: #ff9900;
`;

export const OkButtonText = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 14px;

  color: #312e38;
`;
