'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel, FieldDescription, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon } from '@/components/ui/input-group';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ExempleUser {
  _id?: string;
  name: string;
  age: number;
}

export default function Home() {
  const [users, setUsers] = useState<ExempleUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<ExempleUser | null>(null);
  const [formData, setFormData] = useState<ExempleUser>({ name: '', age: 0 });
  const [errors, setErrors] = useState<{ name?: string; age?: string }>({});

  const API_URL = process.env.API_URL || 'http://localhost:8500';

  // Charger tous les utilisateurs
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/exemple-users`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Validation du formulaire
  const validateForm = (): boolean => {
    const newErrors: { name?: string; age?: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Le nom doit contenir au moins 2 caractères';
    }

    if (formData.age <= 0) {
      newErrors.age = "L'âge doit être supérieur à 0";
    } else if (formData.age > 150) {
      newErrors.age = "L'âge doit être inférieur à 150";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Créer un utilisateur
  const createUser = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/exemple-users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ users: [formData] }),
      });

      if (response.ok) {
        await fetchUsers();
        setFormData({ name: '', age: 0 });
        setErrors({});
      }
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour un utilisateur
  const updateUser = async () => {
    if (!editingUser?._id || !validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/exemple-users/${editingUser._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: formData }),
      });

      if (response.ok) {
        await fetchUsers();
        setFormData({ name: '', age: 0 });
        setEditingUser(null);
        setErrors({});
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un utilisateur
  const deleteUser = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/exemple-users/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchUsers();
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setLoading(false);
    }
  };

  // Préparer l'édition
  const startEdit = (user: ExempleUser) => {
    setEditingUser(user);
    setFormData({ name: user.name, age: user.age });
    setErrors({});
  };

  // Annuler l'édition
  const cancelEdit = () => {
    setEditingUser(null);
    setFormData({ name: '', age: 0 });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-8 dark:bg-black">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Gestion des Utilisateurs
          </h1>
          <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">CRUD complet avec validation et composants UI</p>
        </div>

        {/* Formulaire de création/édition */}
        <Card>
          <CardHeader>
            <CardTitle>{editingUser ? 'Modifier l&apos;utilisateur' : 'Créer un utilisateur'}</CardTitle>
            <CardDescription>
              {editingUser
                ? 'Modifiez les informations ci-dessous'
                : 'Remplissez le formulaire pour ajouter un nouvel utilisateur'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel>Nom</FieldLabel>
                <FieldDescription>{"Entrez le nom de l'utilisateur (minimum 2 caractères)"}</FieldDescription>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                      />
                    </svg>
                  </InputGroupAddon>
                  <Input
                    placeholder="Jean Dupont"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    aria-invalid={!!errors.name}
                  />
                </InputGroup>
                {errors.name && <FieldError>{errors.name}</FieldError>}
              </Field>

              <Field>
                <FieldLabel>Âge</FieldLabel>
                <FieldDescription>Entrez l&apos;âge de l&apos;utilisateur (entre 1 et 150)</FieldDescription>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                      />
                    </svg>
                  </InputGroupAddon>
                  <Input
                    type="number"
                    placeholder="25"
                    value={formData.age || ''}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                    aria-invalid={!!errors.age}
                  />
                </InputGroup>
                {errors.age && <FieldError>{errors.age}</FieldError>}
              </Field>

              <div className="flex gap-3">
                {editingUser ? (
                  <>
                    <Button onClick={updateUser} disabled={loading} className="flex-1">
                      {loading ? 'Mise à jour...' : 'Mettre à jour'}
                    </Button>
                    <Button onClick={cancelEdit} variant="outline" disabled={loading}>
                      Annuler
                    </Button>
                  </>
                ) : (
                  <Button onClick={createUser} disabled={loading} className="w-full">
                    {loading ? 'Création...' : "Créer l'utilisateur"}
                  </Button>
                )}
              </div>
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Tableau des utilisateurs */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des utilisateurs</CardTitle>
            <CardDescription>
              {users.length} utilisateur{users.length !== 1 ? 's' : ''} au total
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading && users.length === 0 ? (
              <div className="py-8 text-center text-zinc-500">Chargement...</div>
            ) : users.length === 0 ? (
              <div className="py-8 text-center text-zinc-500">Aucun utilisateur trouvé. Créez-en un !</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Âge</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.age} ans</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => startEdit(user)} disabled={loading}>
                            Modifier
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => user._id && deleteUser(user._id)}
                            disabled={loading}
                          >
                            Supprimer
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
