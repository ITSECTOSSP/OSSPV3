<?php

namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;

use App\Models\OsspSections;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AdminPanelController extends Controller
{

    public function userTable()
    {
        $users = User::with(['role', 'section'])->paginate(10);


        return Inertia::render('admin/Index', [
            'users' => $users

        ]);
    }

    // Show form for creating user
    public function create()
    {
        $roles = Role::all();
        $sections = OsspSections::all(); // Get all sections for select

        return Inertia::render('admin/user-management/Create', [
            'roles' => $roles,
            'sections' => $sections
        ]);
    }

    // Store new user
    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_number' => 'required|string|max:255|unique:users,employee_number',
            'first_name' => 'required|string|max:255',
            'middle_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role_id' => 'nullable|exists:roles,id',
            'ossp_sections_id' => 'nullable|exists:ossp_sections,id', // Validate section
        ]);

        User::create([
            'employee_number' => strtoupper($validated['employee_number']),
            'first_name' => strtoupper($validated['first_name']),
            'middle_name' => strtoupper($validated['middle_name']),
            'last_name' => strtoupper($validated['last_name']),
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role_id' => $validated['role_id'] ?? null,
            'ossp_sections_id' => $validated['ossp_sections_id'] ?? null, // Save section
        ]);

        return redirect()->route('admin-panel.users.index')
            ->with('success', 'User created successfully.');
    }

    public function edit(User $user)
    {
        $roles = Role::all();
        $sections = OsspSections::all(); // Get all sections for select

        return Inertia::render('admin/user-management/Edit', [
            'user' => $user,
            'roles' => $roles,
            'sections' => $sections
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'employee_number' => 'required|string|max:255|unique:users,employee_number,' . $user->id,
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8|confirmed',
            'role_id' => 'nullable|exists:roles,id',
            'ossp_sections_id' => 'nullable|exists:ossp_sections,id', // Validate section
        ]);

        $user->update([
            'employee_number' => strtoupper($validated['employee_number']),
            'first_name' => strtoupper($validated['first_name']),
            'middle_name' => strtoupper($validated['middle_name']),
            'last_name' => strtoupper($validated['last_name']),
            'email' => $validated['email'],
            'password' => isset($validated['password']) ? Hash::make($validated['password']) : $user->password,
            'role_id' => $validated['role_id'] ?? null,
            'ossp_sections_id' => $validated['ossp_sections_id'] ?? null, // Update section
        ]);

        return redirect()->route('admin-panel.users.index')
            ->with('success', 'User updated successfully.');
    }

    // Delete user
    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->route('admin-panel.users.index')
            ->with('success', 'User deleted successfully.');
    }
}
