// ProfilePage.jsx - Versión simplificada con Mantine
import { useState, useEffect } from 'react';
import {
  Container, Title, Text, Avatar, Paper, Tabs, TextInput, 
  Button, Grid, Stack, Group, Badge, Card, PasswordInput,
  LoadingOverlay, Notification, Progress, List, ThemeIcon,
  ActionIcon, Tooltip, Divider, Alert
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { 
  IconUser, IconLock, IconReceipt, IconEdit, IconMail, 
  IconPhone, IconHome, IconId, IconCheck, IconX,
  IconDeviceFloppy, IconEye, IconEyeOff
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import PurchaseHistoryTab from '../../components/Profile/PurchaseHistoryTab';

// Componente para mostrar info en cards lindas
const InfoCard = ({ icon: Icon, label, value, color }) => (
  <Card shadow="sm" p="lg" radius="md" withBorder>
    <Group>
      <ThemeIcon size="lg" radius="md" variant="light" color={color}>
        <Icon size={20} />
      </ThemeIcon>
      <div style={{ flex: 1 }}>
        <Text size="xs" color="dimmed" weight={500}>{label}</Text>
        <Text size="sm" weight={600}>{value || 'No especificado'}</Text>
      </div>
    </Group>
  </Card>
);

const ProfilePage = () => {
  const { user, getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);

  // Form de perfil con Mantine
  const profileForm = useForm({
    initialValues: {
      nombre: '', apellido: '', email: '', dni: '',
      telefono: '', direccion: '', provincia: '', 
      localidad: '', codigo_postal: ''
    },
    validate: {
      nombre: (value) => (!value ? 'El nombre es requerido' : null),
      apellido: (value) => (!value ? 'El apellido es requerido' : null),
      telefono: (value) => (value && !/^\d{10}$/.test(value.replace(/\D/g, '')) 
        ? 'El teléfono debe tener 10 dígitos' : null),
      codigo_postal: (value) => (value && !/^\d{4}$/.test(value) 
        ? 'El código postal debe tener 4 dígitos' : null),
    }
  });

  // Form de contraseña
  const passwordForm = useForm({
    initialValues: {
      contraseniaActual: '',
      nuevaContrasenia: '',
      confirmarContrasenia: ''
    },
    validate: {
      nuevaContrasenia: (value) => {
        if (!value) return 'La contraseña es requerida';
        if (value.length < 8) return 'Mínimo 8 caracteres';
        if (!/[A-Z]/.test(value)) return 'Debe tener una mayúscula';
        if (!/[a-z]/.test(value)) return 'Debe tener una minúscula';
        if (!/\d/.test(value)) return 'Debe tener un número';
        return null;
      },
      confirmarContrasenia: (value, values) => 
        value !== values.nuevaContrasenia ? 'Las contraseñas no coinciden' : null
    }
  });

  // Cargar datos del perfil
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = getToken();
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        profileForm.setValues(data);
      } catch (error) {
        notifications.show({
          title: 'Error',
          message: 'No pudimos cargar tu perfil',
          color: 'red'
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (user) fetchProfile();
  }, [user]);

  // Handlers
  const handleProfileSubmit = async (values) => {
    try {
      const token = getToken();
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/profile`,
        values,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      notifications.show({
        title: '¡Genial! 🎉',
        message: 'Tu perfil fue actualizado',
        color: 'green'
      });
      setIsEditing(false);
    } catch (error) {
      notifications.show({
        title: 'Ups!',
        message: 'Algo salió mal, intentá de nuevo',
        color: 'red'
      });
    }
  };

  const handlePasswordSubmit = async (values) => {
    try {
      const token = getToken();
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/profile/change-password`,
        {
          contraseniaActual: values.contraseniaActual,
          nuevaContrasenia: values.nuevaContrasenia
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      notifications.show({
        title: '¡Listo! 🔒',
        message: 'Tu contraseña fue actualizada',
        color: 'green'
      });
      passwordForm.reset();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Verificá tu contraseña actual',
        color: 'red'
      });
    }
  };

  // Calcular completitud del perfil
  const calculateCompleteness = () => {
    const fields = Object.values(profileForm.values);
    const filled = fields.filter(f => f).length;
    return Math.round((filled / fields.length) * 100);
  };

  return (
    <Container size="lg" py="xl">
      <LoadingOverlay visible={loading} />
      
      {/* Header */}
      <Stack align="center" mb="xl">
        <Avatar size={100} color="orange" radius="xl">
          {profileForm.values.nombre?.[0]?.toUpperCase() || 'U'}
        </Avatar>
        <Title order={2}>¡Hola, {profileForm.values.nombre || 'Usuario'}! 👋</Title>
        <Text color="dimmed">Gestioná tu cuenta desde acá</Text>
        
        {/* Barra de progreso del perfil */}
        <Paper p="md" radius="md" withBorder style={{ width: '100%', maxWidth: 400 }}>
          <Text size="sm" weight={500} mb="xs">
            Tu perfil está {calculateCompleteness()}% completo
          </Text>
          <Progress value={calculateCompleteness()} color="orange" size="lg" radius="xl" />
        </Paper>
      </Stack>

      {/* Tabs principales */}
      <Tabs value={activeTab} onTabChange={setActiveTab} color="orange">
        <Tabs.List grow>
          <Tabs.Tab value="profile" icon={<IconUser size={16} />}>Mi Perfil</Tabs.Tab>
          <Tabs.Tab value="security" icon={<IconLock size={16} />}>Seguridad</Tabs.Tab>
          <Tabs.Tab value="purchases" icon={<IconReceipt size={16} />}>Mis Compras</Tabs.Tab>
        </Tabs.List>

        {/* Tab Perfil */}
        <Tabs.Panel value="profile" pt="xl">
          {isEditing ? (
            <form onSubmit={profileForm.onSubmit(handleProfileSubmit)}>
              <Stack spacing="md">
                <Title order={4}>Editá tu información</Title>
                
                <Grid>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="Nombre"
                      placeholder="Juan"
                      icon={<IconUser size={16} />}
                      {...profileForm.getInputProps('nombre')}
                      required
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="Apellido"
                      placeholder="Pérez"
                      {...profileForm.getInputProps('apellido')}
                      required
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="Email"
                      icon={<IconMail size={16} />}
                      {...profileForm.getInputProps('email')}
                      disabled
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="DNI"
                      placeholder="12345678"
                      icon={<IconId size={16} />}
                      {...profileForm.getInputProps('dni')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="Teléfono"
                      placeholder="1123456789"
                      icon={<IconPhone size={16} />}
                      {...profileForm.getInputProps('telefono')}
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Divider my="md" label="Dirección de envío" labelPosition="center" />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <TextInput
                      label="Dirección"
                      placeholder="Av. Corrientes 1234, 5° B"
                      icon={<IconHome size={16} />}
                      {...profileForm.getInputProps('direccion')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 4 }}>
                    <TextInput
                      label="Localidad"
                      placeholder="CABA"
                      {...profileForm.getInputProps('localidad')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 4 }}>
                    <TextInput
                      label="Provincia"
                      placeholder="Buenos Aires"
                      {...profileForm.getInputProps('provincia')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 4 }}>
                    <TextInput
                      label="Código Postal"
                      placeholder="1234"
                      {...profileForm.getInputProps('codigo_postal')}
                    />
                  </Grid.Col>
                </Grid>

                <Group position="right" mt="md">
                  <Button variant="subtle" onClick={() => setIsEditing(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" color="orange" leftIcon={<IconDeviceFloppy size={16} />}>
                    Guardar cambios
                  </Button>
                </Group>
              </Stack>
            </form>
          ) : (
            <Stack>
              <Group position="apart" mb="md">
                <Title order={4}>Tu información</Title>
                <Button 
                  leftIcon={<IconEdit size={16} />} 
                  variant="light" 
                  color="orange"
                  onClick={() => setIsEditing(true)}
                >
                  Editar
                </Button>
              </Group>

              <Grid>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <InfoCard
                    icon={IconUser}
                    label="Nombre completo"
                    value={`${profileForm.values.nombre} ${profileForm.values.apellido}`.trim()}
                    color="blue"
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <InfoCard
                    icon={IconMail}
                    label="Email"
                    value={profileForm.values.email}
                    color="teal"
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <InfoCard
                    icon={IconId}
                    label="DNI"
                    value={profileForm.values.dni}
                    color="violet"
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <InfoCard
                    icon={IconPhone}
                    label="Teléfono"
                    value={profileForm.values.telefono}
                    color="green"
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 8 }}>
                  <InfoCard
                    icon={IconHome}
                    label="Dirección de envío"
                    value={[
                      profileForm.values.direccion,
                      profileForm.values.localidad,
                      profileForm.values.provincia,
                      profileForm.values.codigo_postal && `CP: ${profileForm.values.codigo_postal}`
                    ].filter(Boolean).join(', ')}
                    color="orange"
                  />
                </Grid.Col>
              </Grid>
            </Stack>
          )}
        </Tabs.Panel>

        {/* Tab Seguridad */}
        <Tabs.Panel value="security" pt="xl">
          <Paper p="xl" radius="md" withBorder style={{ maxWidth: 500, margin: '0 auto' }}>
            <form onSubmit={passwordForm.onSubmit(handlePasswordSubmit)}>
              <Stack>
                <Title order={4}>Cambiá tu contraseña</Title>
                <Text size="sm" color="dimmed">
                  Te recomendamos cambiarla cada 3 meses
                </Text>

                <PasswordInput
                  label="Contraseña actual"
                  placeholder="••••••••"
                  {...passwordForm.getInputProps('contraseniaActual')}
                  required
                />

                <PasswordInput
                  label="Nueva contraseña"
                  placeholder="••••••••"
                  {...passwordForm.getInputProps('nuevaContrasenia')}
                  required
                />

                <PasswordInput
                  label="Confirmá la nueva contraseña"
                  placeholder="••••••••"
                  {...passwordForm.getInputProps('confirmarContrasenia')}
                  required
                />

                <Alert icon={<IconLock size={16} />} color="blue" variant="light">
                  La contraseña debe tener al menos 8 caracteres, una mayúscula, 
                  una minúscula y un número.
                </Alert>

                <Button type="submit" color="orange" fullWidth mt="md">
                  Actualizar contraseña
                </Button>
              </Stack>
            </form>
          </Paper>
        </Tabs.Panel>

        {/* Tab Compras */}
        <Tabs.Panel value="purchases" pt="xl">
          <PurchaseHistoryTab />
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
};

export default ProfilePage;