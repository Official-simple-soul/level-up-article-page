<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\File;
use Illuminate\Validation\Rules\Password;

class UserController
{
    private UserService $userService;

    public function __construct(UserService $service)
    {
        $this->userService = $service;
    }

    public function index(Request $request)
    {
        $page = (int) ($request->input('page') ?? 1);
        $pageSize = (int) ($request->input('perPage') ?? 5);
        $sorts = $request->input('sort') ?? [];

        $query = $this->userService->listAllUsers($sorts);

        return $query
            ->paginate(perPage: $pageSize, page: $page)
            ->withQueryString();
    }

    public function show(User $user)
    {
        return $user;
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', Password::defaults()],
            'avatar' => ['nullable', File::image()->max('5mb')],
        ]);

        $user = $this->userService->store(
            $validated['name'],
            $validated['email'],
            $validated['password'],
            $request->file('avatar')
        );

        return response()->json($user, 201);
    }

    public function update(Request $request, User $user)
    {
        if ($user->id !== auth()->id()) {
            abort(403, 'You can only edit your own profile');
        }

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'newPassword' => ['sometimes', Password::defaults()],
            'avatar' => ['nullable', File::image()->max('5mb')],
            'remove_avatar' => ['nullable', 'boolean'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:users,slug,' . $user->id],
        ]);

        
        if (isset($validated['newPassword'])) {
            $validated['password'] = $validated['newPassword'];
            unset($validated['newPassword']);
        }

        $user = $this->userService->update(
            $user,
            $validated,
            $request->file('avatar'),
            $request->boolean('remove_avatar')
        );

        return $user;
    }

    public function destroy(User $user)
    {
        if ($user->id !== auth()->id()) {
            abort(403, 'You can only delete your own account');
        }

        $this->userService->delete($user);
        return response()->noContent();
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $user = $this->userService->findByEmail($validated['email']);

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            abort(401, 'Invalid credentials');
        }

        $token = $user->createToken('auth-token');

        return [
            'type' => 'Bearer',
            'token' => $token->plainTextToken
        ];
    }
}
