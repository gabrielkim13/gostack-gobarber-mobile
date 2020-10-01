import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { StatusBar, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import DateTimePicker, {
  AndroidEvent,
} from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

import api from '../../services/api';

import { useAuth } from '../../hooks/auth';

import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  ProvidersListContainer,
  ProvidersList,
  ProviderItem,
  ProviderAvatar,
  ProviderName,
  Calendar,
  CalendarText,
  CalendarButton,
  CalendarButtonText,
  TimeContainer,
  TimeTitle,
  TimePeriod,
  TimeList,
  TimeItem,
  TimeText,
  CreateAppointmentButton,
  CreateAppointmentText,
} from './styles';

export interface Provider {
  id: string;
  name: string;
  avatar_url: string;
}

export interface Time {
  hour: number;
  formattedHour: string;
  available: boolean;
}

interface RouteParams {
  providerId: string;
}

interface DayAvailability {
  hour: number;
  available: boolean;
}

const CreateAppointment: React.FC = () => {
  const { user } = useAuth();

  const { params } = useRoute() as { params: RouteParams };
  const { navigate, goBack } = useNavigation();

  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState(params.providerId);

  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(-1);

  const [availability, setAvailability] = useState<DayAvailability[]>([]);

  const morningAvailability = useMemo(
    () =>
      availability
        .filter(({ hour }) => hour < 12)
        .map(({ hour, available }) => ({
          hour,
          formattedHour: format(new Date().setHours(hour), 'HH:00'),
          available,
        })),
    [availability],
  );

  const afternoonAvailability = useMemo(
    () =>
      availability
        .filter(({ hour }) => hour >= 12)
        .map(({ hour, available }) => ({
          hour,
          formattedHour: format(new Date().setHours(hour), 'HH:00'),
          available,
        })),
    [availability],
  );

  const handleSelectProvider = useCallback(
    (providerId: string) => setSelectedProvider(providerId),
    [],
  );

  const handleToggleDateTimePicker = useCallback(
    () => setShowDateTimePicker(state => !state),
    [],
  );

  const handleSelectTime = useCallback(
    (time: number) => setSelectedTime(time),
    [],
  );

  const handleDateChange = useCallback((event: AndroidEvent, date?: Date) => {
    setShowDateTimePicker(false);

    if (date) {
      setSelectedDate(date);
    }
  }, []);

  const handleCreateAppointment = useCallback(async () => {
    try {
      const date = new Date(selectedDate);

      date.setHours(selectedTime);
      date.setMinutes(0);

      api.post('appointments', {
        provider_id: selectedProvider,
        date,
      });

      navigate('AppointmentCreated', { date: date.getTime() });
    } catch (err) {
      Alert.alert(
        'Erro ao criar agendamento',
        'Ocorreu um erro ao tentar criar o agendamento, tente novamente.',
      );
    }
  }, [navigate, selectedDate, selectedTime, selectedProvider]);

  const renderProviderItem = useCallback(
    ({ item: provider }: { item: Provider }) => (
      <ProviderItem
        selected={selectedProvider === provider.id}
        onPress={() => handleSelectProvider(provider.id)}
      >
        <ProviderAvatar source={{ uri: provider.avatar_url }} />

        <ProviderName selected={selectedProvider === provider.id}>
          {provider.name}
        </ProviderName>
      </ProviderItem>
    ),
    [selectedProvider, handleSelectProvider],
  );

  const renderTimeItem = useCallback(
    ({ item: time }: { item: Time }) => (
      <TimeItem
        disabled={!time.available}
        selected={selectedTime === time.hour}
        enabled={time.available}
        onPress={() => handleSelectTime(time.hour)}
      >
        <TimeText selected={selectedTime === time.hour}>
          {time.formattedHour}
        </TimeText>
      </TimeItem>
    ),
    [selectedTime, handleSelectTime],
  );

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

  useEffect(() => {
    async function fetchDayAvailability() {
      try {
        const response = await api.get<DayAvailability[]>(
          `providers/${selectedProvider}/day-availability`,
          {
            params: {
              year: selectedDate.getFullYear(),
              month: selectedDate.getMonth() + 1,
              day: selectedDate.getDate(),
            },
          },
        );

        setAvailability(response.data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchDayAvailability();
  }, [selectedDate, selectedProvider]);

  return (
    <Container>
      <StatusBar barStyle="light-content" backgroundColor="#28262e" />

      <Header>
        <BackButton onPress={goBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <HeaderTitle>Agendamento</HeaderTitle>

        <UserAvatar source={{ uri: user.avatar_url }} />
      </Header>

      <ProvidersListContainer>
        <ProvidersList
          data={providers}
          renderItem={renderProviderItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </ProvidersListContainer>

      <Calendar>
        <CalendarText>Escolha a data</CalendarText>

        <CalendarButton onPress={handleToggleDateTimePicker}>
          <CalendarButtonText>Selecione outra data</CalendarButtonText>
        </CalendarButton>

        {showDateTimePicker && (
          <DateTimePicker
            mode="date"
            display="calendar"
            value={selectedDate}
            onChange={handleDateChange}
          />
        )}
      </Calendar>

      <TimeContainer>
        <TimeTitle>Escolha o horário</TimeTitle>

        <TimePeriod>Manhã</TimePeriod>
        <TimeList
          data={morningAvailability}
          renderItem={renderTimeItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />

        <TimePeriod>Tarde</TimePeriod>
        <TimeList
          data={afternoonAvailability}
          renderItem={renderTimeItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </TimeContainer>

      <CreateAppointmentButton onPress={handleCreateAppointment}>
        <CreateAppointmentText>Agendar</CreateAppointmentText>
      </CreateAppointmentButton>
    </Container>
  );
};

export default CreateAppointment;
