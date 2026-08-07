<?php

namespace App\Enums;

enum OrderPaymentMethod: string
{
    case Cash = 'cash';
    case Card = 'card';
}