<?php

use App\Models\Category;
use App\Models\Saucer;
use App\Models\SaucerImage;
use App\Models\User;

it('destroys a saucer image', function () {
    $user = User::factory()->create(['role' => 'admin']);
    $category = Category::create(['name' => 'Sushis', 'slug' => 'sushis']);
    $saucer = Saucer::create([
        'category_id' => $category->id,
        'name' => 'Sushi culero',
        'slug' => 'sushi-culero',
        'price' => 10,
        'available' => true,
    ]);
    $image = SaucerImage::create([
        'saucer_id' => $saucer->id,
        'image' => 'saucers/test.jpg',
        'position' => 1,
    ]);

    $this->actingAs($user)->delete(route('saucers.images.destroy', [
        'category' => $category,
        'saucer' => $saucer,
        'image' => $image,
    ]))->assertRedirect(route('saucers.manage', [$category, $saucer]));

    $this->assertDatabaseMissing('saucer_images', ['id' => $image->id]);
});
