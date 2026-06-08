import { Button } from '@/components/ui/button';
import {
    FieldContent,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { OsspSections, User, UserRole } from '@/types';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';

interface UserFormData {
    employee_number: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role_id: string;
    ossp_sections_id: string;
}

interface Props {
    roles: UserRole[];
    sections: OsspSections[];
    user?: User;
    url: string;
    method: 'post' | 'put';
}

export default function UserForm({ roles, sections, user }: Props) {
    const isEdit = !!user;

    const { data, setData, post, put, processing, errors } =
        useForm<UserFormData>({
            employee_number: user?.employee_number || '',
            first_name: user?.first_name || '',
            middle_name: user?.middle_name || '',
            last_name: user?.last_name || '',
            email: user?.email || '',
            password: '',
            password_confirmation: '',
            role_id: user?.role_id ? String(user.role_id) : '',
            ossp_sections_id: user?.ossp_sections_id
                ? String(user.ossp_sections_id)
                : '',
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            put(route('admin-panel.users.update', user.id));
        } else {
            post(route('admin-panel.users.store'));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <FieldGroup>
                <FieldLabel>Employee Number</FieldLabel>
                <FieldContent>
                    <Input
                        value={data.employee_number}
                        onChange={(e) =>
                            setData('employee_number', e.target.value)
                        }
                        placeholder="Enter employee number"
                    />
                </FieldContent>
                <FieldError>{errors.employee_number}</FieldError>
            </FieldGroup>

            <FieldGroup>
                <FieldLabel>First Name</FieldLabel>
                <FieldContent>
                    <Input
                        value={data.first_name}
                        onChange={(e) => setData('first_name', e.target.value)}
                        placeholder="Enter first name"
                    />
                </FieldContent>
                <FieldError>{errors.first_name}</FieldError>
            </FieldGroup>

            <FieldGroup>
                <FieldLabel>Middle Name</FieldLabel>
                <FieldContent>
                    <Input
                        value={data.middle_name}
                        onChange={(e) => setData('middle_name', e.target.value)}
                        placeholder="Enter middle name"
                    />
                </FieldContent>
                <FieldError>{errors.middle_name}</FieldError>
            </FieldGroup>
            <FieldGroup>
                <FieldLabel>LastName</FieldLabel>
                <FieldContent>
                    <Input
                        value={data.last_name}
                        onChange={(e) => setData('last_name', e.target.value)}
                        placeholder="Enter last name"
                    />
                </FieldContent>
                <FieldError>{errors.last_name}</FieldError>
            </FieldGroup>
            <FieldGroup>
                <FieldLabel>Email</FieldLabel>
                <FieldContent>
                    <Input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="Enter email"
                    />
                </FieldContent>
                <FieldError>{errors.email}</FieldError>
            </FieldGroup>

            <FieldGroup>
                <FieldLabel>Password</FieldLabel>
                <FieldContent>
                    <Input
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder={
                            isEdit
                                ? 'Leave blank to keep current password'
                                : 'Enter password'
                        }
                    />
                </FieldContent>
                <FieldError>{errors.password}</FieldError>
            </FieldGroup>

            <FieldGroup>
                <FieldLabel>Confirm Password</FieldLabel>
                <FieldContent>
                    <Input
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        placeholder="Confirm password"
                    />
                </FieldContent>
                <FieldError>{errors.password_confirmation}</FieldError>
            </FieldGroup>

            <FieldGroup>
                <FieldLabel>Role</FieldLabel>
                <FieldContent>
                    <Select
                        value={data.role_id}
                        onValueChange={(value) => setData('role_id', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Roles</SelectLabel>

                                {roles.map((role) => (
                                    <SelectItem
                                        key={role.id}
                                        value={String(role.id)}
                                    >
                                        {role.name.toUpperCase()}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </FieldContent>
                <FieldError>{errors.role_id}</FieldError>
            </FieldGroup>

            <FieldGroup>
                <FieldLabel>Section</FieldLabel>
                <FieldContent>
                    <Select
                        value={data.ossp_sections_id}
                        onValueChange={(value) =>
                            setData('ossp_sections_id', value)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select section" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Sections</SelectLabel>

                                {sections.map((section) => (
                                    <SelectItem
                                        key={section.id}
                                        value={String(section.id)}
                                    >
                                        {section.sections_name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </FieldContent>
                <FieldError>{errors.ossp_sections_id}</FieldError>
            </FieldGroup>

            <Button type="submit" disabled={processing}>
                {isEdit ? 'Update User' : 'Create User'}
            </Button>
        </form>
    );
}
