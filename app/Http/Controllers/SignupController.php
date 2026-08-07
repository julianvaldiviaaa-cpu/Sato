<?php

namespace App\Http\Controllers;

use App\Http\Requests\SignupRequest;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SignupController extends Controller
{
    public function index()
    {
        return Inertia::render("Auth/Signup");
    }

    public function store(SignupRequest $request)
    {
        $data = $request->validated();
        $user = User::create($data);

        event(new Registered($user));

        Auth::login($user, true);

        return redirect()->route("verification.notice");
    }
}
