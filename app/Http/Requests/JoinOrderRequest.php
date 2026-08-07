<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class JoinOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code' => ['required', 'digits:6', "exists:orders,code"],
        ];
    }

    public function messages(): array
    {
        return [
            "code.required" => "El codigo es obligatorio",
            "code.digits" => "El codigo debe ser de 6 digitos"
        ];
    }
}
