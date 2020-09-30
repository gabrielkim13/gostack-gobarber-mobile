import React, { useCallback, useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

import { useAuth } from '../../hooks/auth';

import api from '../../services/api';

import {
  Container,
  Header,
  HeaderText,
  HeaderUserName,
  ProfileButton,
  HeaderUserAvatar,
  Content,
  ProvidersTitle,
  ProvidersList,
  ProviderItem,
  ProviderAvatar,
  ProviderInfo,
  ProviderName,
  ProviderDateTime,
  ProviderDateTimeText,
} from './styles';

export interface Provider {
  id: string;
  name: string;
  avatar_url: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { navigate } = useNavigation();

  const [providers, setProviders] = useState<Provider[]>([]);

  useEffect(() => {
    async function fetchProviders() {
      try {
        const response = await api.get<Provider[]>('providers');

        setProviders(response.data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchProviders();
  }, []);

  const handleNavigateToProfile = useCallback(() => {
    navigate('Profile');
  }, [navigate]);

  const handleNavigateToCreateAppointment = useCallback(
    (providerId: string) => {
      navigate('CreateAppointment', { providerId });
    },
    [navigate],
  );

  const renderProviderItem = useCallback(
    ({ item: provider }: { item: Provider }) => (
      <ProviderItem
        onPress={() => handleNavigateToCreateAppointment(provider.id)}
      >
        <ProviderAvatar source={{ uri: provider.avatar_url }} />

        <ProviderInfo>
          <ProviderName>{provider.name}</ProviderName>
          <ProviderDateTime>
            <Icon name="calendar" size={12} color="#ff9900" />
            <ProviderDateTimeText>Segunda à sexta</ProviderDateTimeText>
          </ProviderDateTime>
          <ProviderDateTime>
            <Icon name="clock" size={12} color="#ff9900" />
            <ProviderDateTimeText>8h às 18h</ProviderDateTimeText>
          </ProviderDateTime>
        </ProviderInfo>
      </ProviderItem>
    ),
    [handleNavigateToCreateAppointment],
  );

  return (
    <Container>
      <StatusBar barStyle="light-content" backgroundColor="#28262e" />

      <Header>
        <HeaderText>
          Bem vindo,
          {'\n'}
          <HeaderUserName>{user.name}</HeaderUserName>
        </HeaderText>

        <ProfileButton onPress={handleNavigateToProfile}>
          <HeaderUserAvatar source={{ uri: user.avatar_url }} />
        </ProfileButton>
      </Header>

      <Content>
        <ProvidersList
          data={providers}
          renderItem={renderProviderItem}
          keyExtractor={item => item.id}
          ListHeaderComponent={<ProvidersTitle>Cabeleireiros</ProvidersTitle>}
        />
      </Content>
    </Container>
  );
};

export default Dashboard;
