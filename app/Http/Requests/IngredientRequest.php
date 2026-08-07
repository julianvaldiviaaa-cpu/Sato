<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class IngredientRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "name" => ["required", "string", "max:255"],
            "description" => ["nullable", "string", "max:1000"],
            "cost" => ["required", "numeric", "min:0"],
            "stock" => ["required", "numeric", "min:0"],
            "unit" => ["required", "string", Rule::in(["kg", "g", "l", "ml", "piece"])],
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
            "name.required" => "El nombre del ingrediente es obligatorio.",
            "name.string" => "El nombre del ingrediente debe ser texto.",
            "name.max" => "El nombre del ingrediente no puede tener más de :max caracteres.",

            "description.string" => "La descripción debe ser texto.",
            "description.max" => "La descripción no puede tener más de :max caracteres.",

            "cost.required" => "El costo es obligatorio.",
            "cost.numeric" => "El costo debe ser un número.",
            "cost.min" => "El costo no puede ser negativo.",

            "stock.required" => "Las existencias son obligatorias.",
            "stock.numeric" => "Las existencias deben ser un número.",
            "stock.min" => "Las existencias no pueden ser negativas.",

            "unit.required" => "La unidad es obligatoria.",
            "unit.in" => "La unidad debe ser una de las siguientes: kg, g, l, ml, piece.",
        ];
    }
}
