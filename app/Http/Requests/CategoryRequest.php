<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CategoryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre de la categoría es obligatorio.',
            'name.string' => 'El nombre de la categoría debe ser un texto.',
            'name.max' => 'El nombre de la categoría no puede superar los :max caracteres.',

            'description.string' => 'La descripción debe ser un texto.',
            'description.max' => 'La descripción no puede superar los :max caracteres.',
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'nombre de la categoría',
            'description' => 'descripción',
        ];
    }
}
