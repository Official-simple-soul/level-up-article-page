<?php

namespace App\Models\Services;

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Builder;

class UserService
{
    public function listAllUsers(array $sorts = []): Builder
    {
        $query = User::query();

        foreach ($sorts as $field => $direction) {
            $query->orderBy($field, $direction);
        }

        return $query;
    }

    public function store(string $name, string $email, string $password, ?UploadedFile $avatar = null): User
    {
        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
        ]);

        if ($avatar) {
            $this->updateAvatar($user, $avatar);
        }

        return $user;
    }

    public function update(User $user, array $validated, ?UploadedFile $avatar = null, bool $removeAvatar = false)
    {
        // Handle password separately to ensure proper hashing
        if (isset($validated['password'])) {
            $user->password = Hash::make($validated['password']);
            unset($validated['password']); // Remove from validated array to prevent double processing
        }

        // Fill the validated data first
        $user->fill($validated);

        // Handle avatar
        if ($removeAvatar) {
            $this->deleteAvatar($user, false); // Pass false to prevent saving
            $user->avatar = null;
        } elseif ($avatar) {
            $path = $this->updateAvatar($user, $avatar, false); // Pass false to prevent saving
            $user->avatar = $path;
        }

        // Save all changes at once
        $user->save();

        return $user->fresh();
    }

    public function updateAvatar(User $user, UploadedFile $avatar, bool $saveUser = true): string
    {
        // Delete old avatar if exists
        if ($user->avatar) {
            $this->deleteAvatar($user, false);
        }

        // Generate a unique filename
        $filename = time() . '_' . str_replace(' ', '_', $avatar->getClientOriginalName());
        
        // Move the uploaded file to storage
        $path = 'avatars/' . $filename;
        Storage::disk('public')->put(
            $path,
            file_get_contents($avatar->getRealPath())
        );

        // Update the user with the storage path
        if ($saveUser) {
            $user->avatar = $path;
            $user->save();
        }

        return $path;
    }

    public function deleteAvatar(User $user, bool $saveUser = true): void
    {
        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
            if ($saveUser) {
                $user->avatar = null;
                $user->save();
            }
        }
    }

    public function delete(User $user): void
    {
        $user->articles()->delete();

        if ($user->avatar) {
            $this->deleteAvatar($user);
        }

        $user->delete();
    }

    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }
}
