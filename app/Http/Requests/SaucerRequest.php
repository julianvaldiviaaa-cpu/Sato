<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SaucerRequest extends FormRequest
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
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "name" => ["required", "string", "max:255"],
            "description" => ["nullable", "string", "max:1000"],
            "price" => ["required", "numeric", "min:0"],
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            "name.required" => "El nombre del platillo es obligatorio.",
            "name.string" => "El nombre del platillo debe ser texto.",
            "name.max" => "El nombre del platillo no puede tener más de :max caracteres.",

            "description.string" => "La descripción debe ser texto.",
            "description.max" => "La descripción no puede tener más de :max caracteres.",

            "price.required" => "El precio es obligatorio.",
            "price.numeric" => "El precio debe ser un número.",
            "price.min" => "El precio no puede ser negativo.",
        ];
    }
}
