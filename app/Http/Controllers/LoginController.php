<?php

namespace App\Http\Controllers;
use App\Http\Requests\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LoginController extends Controller
{
    public function index()
    {
        return Inertia::render("Auth/Login");
    }

    public function store(LoginRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if (! Auth::attempt($data, true)) {
            return back()
                ->withErrors(['email' => 'Las credenciales proporcionadas no son correctas.'])
                ->onlyInput('email');
        }

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard'));
    }

}
