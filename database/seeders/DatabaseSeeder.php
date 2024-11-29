<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Comment;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(10)->create();

        User::factory()
            ->set('name', 'Francisco')
            ->set('email', 'francisco@internetbrands.com')
            ->set('password', 'test1234')
            ->has(
                Article::factory(1)
                    ->has(Comment::factory(1))
            )
            ->createOne();

        $this->call(ArticleSeeder::class);
    }
}
