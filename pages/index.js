import Container from '../components/container';
import MoreStories from '../components/more-stories';
import ContentfulImage from '../components/contentful-image';
import HeroPost from '../components/hero-post';
import CompetitionPreview from '../components/competition-preview';
import PostPreview from '../components/post-preview';
import Intro from '../components/intro';
import Layout from '../components/layout';
import CoverImage from '../components/cover-image';
import {
	getAllCompetitionsForHome,
	getAllPostsForHome,
	getAllPlayers,
	getTop10Players,
} from '../lib/api';
import Head from 'next/head';
import Navbar from '../components/Navbars/AuthNavbar.js';
import Link from 'next/link';

export default function Index({
	preview,
	allPosts,
	allPlayers,
	competittions,
}) {
	const heroPost = allPosts[0];
	const upcomingCompetition = competittions[0];
	const morePosts = allPosts.slice(1);

	console.log('players', allPlayers);
	console.log('posts', morePosts);
	console.log('competittions', competittions);

	return (
		<>
			<Layout preview={preview}>
				<Head>
					<title>
						AVTA - Australia Vietnamese Tennis Association
					</title>
				</Head>
				<Navbar />
				<Intro upcomingCompetition={upcomingCompetition} />

				<div className='container mx-auto mt-12'>
					<div className='flex flex-wrap items-center'>
						<div className='w-10/12 md:w-6/12 lg:w-4/12 px-12 md:px-4 mr-auto ml-auto -mt-32'>
							<div className='relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl border border-gray-100 rounded-lg bg-blue-500'>
								<ContentfulImage
									width={2000}
									height={1000}
									className='w-full align-middle rounded-t-lg'
									src={heroPost.coverImage.url}
								/>
								<blockquote className='relative p-8 mb-4'>
									<svg
										preserveAspectRatio='none'
										xmlns='http://www.w3.org/2000/svg'
										viewBox='0 0 583 95'
										className='absolute left-0 w-full block h-95-px -top-94-px'
									>
										<polygon
											points='-30,95 583,95 583,65'
											className='text-blue-500 fill-current'
										></polygon>
									</svg>
									<h4 className='text-xl font-bold text-white'>
										{heroPost?.title}
									</h4>
									<p className='text-md font-light mt-2 text-white'>
										{heroPost.excerpt}
									</p>
								</blockquote>
							</div>
						</div>

						<div className='w-full md:w-6/12 px-4'>
							<h2 className='mb-8 text-2xl md:text-3xl font-bold tracking-tighter leading-tight'>
								More Stories
							</h2>
							<div className='grid grid-cols-1 md:grid-cols-2 md:gap-x-10 lg:gap-x-16 gap-y-20 mb-32'>
								{morePosts.splice(0, 4).map((post) => (
									<PostPreview
										key={post.slug}
										title={post.title}
										coverImage={post.coverImage}
										date={post.date}
										author={post.author}
										slug={post.slug}
										excerpt={post.excerpt}
									/>
								))}
							</div>
						</div>
					</div>
				</div>
			</Layout>
		</>
	);
}

export async function getStaticProps({ preview = false }) {
	const allPosts = (await getAllPostsForHome(preview)) ?? [];
	const allPlayers = (await getTop10Players(preview)) ?? [];
	const competittions = (await getAllCompetitionsForHome(preview)) ?? [];

	return {
		props: { preview, allPosts, allPlayers, competittions },
		revalidate: 60,
	};
}
