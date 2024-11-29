<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\User;
use Database\Factories\UserFactory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    public function test_deleting_user_cascades_to_articles(): void
    {
        $user = UserFactory::new()->createOne();
        $articles = Article::factory()
            ->count(3)
            ->for($user, 'author')
            ->create();

        $response = $this
            ->actingAs($user)
            ->deleteJson("/api/users/{$user->id}");

        $response->assertNoContent();
        $this->assertDatabaseMissing('users', ['id' => $user->id]);
        $this->assertDatabaseEmpty('articles');
    }

    public function test_user_can_upload_avatar(): void
    {
        $user = UserFactory::new()->createOne();
        
        $file = \Illuminate\Http\UploadedFile::fake()->image('avatar.jpg');

        $response = $this
            ->actingAs($user)
            ->putJson(
                "/api/users/{$user->id}",
                [
                    'avatar' => $file
                ]
            );

        $response->assertOk();
        $this->assertNotNull($response->json('avatar'));
        
        $avatarPath = str_replace('/storage/', '', $response->json('avatar'));
        \Storage::disk('public')->assertExists($avatarPath);
    }

    public function test_user_can_remove_avatar(): void
    {
        $user = UserFactory::new()->createOne();
        $file = \Illuminate\Http\UploadedFile::fake()->image('avatar.jpg');
        
        $this->actingAs($user)
            ->putJson("/api/users/{$user->id}", ['avatar' => $file]);

        $response = $this
            ->actingAs($user)
            ->putJson(
                "/api/users/{$user->id}",
                ['remove_avatar' => true]
            );

        $response->assertOk();
        $this->assertNull($response->json('avatar'));
    }
} 