import React, { useRef, useCallback } from 'react';
import {
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  TextInput,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Feather';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/mobile';
import * as Yup from 'yup';

import api from '../../services/api';
import { useAuth } from '../../hooks/auth';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import {
  Container,
  Header,
  HeaderButton,
  HeaderText,
  UserAvatarButton,
  UserAvatarImage,
} from './styles';

interface ProfileFormData {
  name: string;
  email: string;
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const Profile: React.FC = () => {
  const { user, signOut, updateUser } = useAuth();

  const formRef = useRef<FormHandles>(null);

  const emailInputRef = useRef<TextInput>(null);
  const oldPasswordInputRef = useRef<TextInput>(null);
  const newPasswordInputRef = useRef<TextInput>(null);
  const confirmNewPasswordInputRef = useRef<TextInput>(null);

  const { goBack } = useNavigation();

  const handleChangeAvatar = useCallback(() => {
    ImagePicker.showImagePicker(
      {
        title: 'Selecione um avatar',
        cancelButtonTitle: 'Cancelar',
        takePhotoButtonTitle: 'Tirar foto',
        chooseFromLibraryButtonTitle: 'Escolher imagem',
      },
      async response => {
        if (response.didCancel) {
          return;
        }

        if (response.error) {
          Alert.alert('Erro ao atualizar o avatar');

          return;
        }

        const data = new FormData();
        data.append('avatar', {
          type: 'image/jpeg',
          uri: response.uri,
          name: `${user.id}.jpg`,
        });

        const apiResponse = await api.patch('users/avatar', data);

        updateUser(apiResponse.data);
      },
    );
  }, [user, updateUser]);

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        if (formRef.current) formRef.current.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          oldPassword: Yup.string(),
          newPassword: Yup.string().when('oldPassword', {
            is: value => !!value.length,
            then: Yup.string().required('Informe a nova senha'),
            otherwise: Yup.string(),
          }),
          newPasswordConfirmation: Yup.string()
            .when('oldPassword', {
              is: value => !!value.length,
              then: Yup.string().required('Informe a nova senha'),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('newPassword')], 'As senhas não são iguais'),
        });

        await schema.validate(data, { abortEarly: false });
        const { name, email, oldPassword, newPassword } = data;

        const formData = {
          name,
          email,
          ...(oldPassword
            ? {
                oldPassword,
                newPassword,
              }
            : {}),
        };

        const response = await api.put('/profile', formData);

        await updateUser(response.data);

        Alert.alert('Perfil atualizado com sucesso!');

        goBack();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          if (formRef.current) formRef.current.setErrors(errors);

          return;
        }

        Alert.alert(
          'Erro na atualização do perfil',
          'Ocorreu um erro ao atualizar o perfil, tente novamente.',
        );
      }
    },
    [goBack, updateUser],
  );

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <Header>
              <HeaderButton onPress={goBack}>
                <Icon name="arrow-left" size={20} color="#999591" />
              </HeaderButton>

              <HeaderText>Meu Perfil</HeaderText>

              <HeaderButton onPress={signOut}>
                <Icon name="power" size={20} color="#999591" />
              </HeaderButton>
            </Header>

            <UserAvatarButton onPress={handleChangeAvatar}>
              <UserAvatarImage source={{ uri: user.avatar_url }} />
            </UserAvatarButton>

            <Form ref={formRef} onSubmit={handleSubmit} initialData={user}>
              <Input
                name="name"
                icon="user"
                placeholder="Nome"
                autoCapitalize="words"
                onSubmitEditing={() => emailInputRef.current?.focus()}
              />
              <Input
                ref={emailInputRef}
                name="email"
                icon="mail"
                placeholder="E-mail"
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() => oldPasswordInputRef.current?.focus()}
              />
              <Input
                ref={oldPasswordInputRef}
                name="oldPassword"
                icon="lock"
                placeholder="Senha atual"
                containerStyle={{ marginTop: 24 }}
                secureTextEntry
                textContentType="newPassword"
                returnKeyType="next"
                onSubmitEditing={() => newPasswordInputRef.current?.focus()}
              />
              <Input
                ref={newPasswordInputRef}
                name="newPassword"
                icon="lock"
                placeholder="Nova senha"
                secureTextEntry
                textContentType="newPassword"
                returnKeyType="next"
                onSubmitEditing={() =>
                  confirmNewPasswordInputRef.current?.focus()
                }
              />
              <Input
                ref={confirmNewPasswordInputRef}
                name="confirmNewPassword"
                icon="lock"
                placeholder="Confirmar senha"
                secureTextEntry
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
              />
            </Form>

            <Button onPress={() => formRef.current?.submitForm()}>
              Confirmar mudanças
            </Button>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default Profile;
