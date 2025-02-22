import React, { useState } from 'react';
import '../../assets/scss/pages/product.scss';
import Pagination from '../../components/ProductPage/Pagination';
import { Link } from 'react-router-dom';

function Productspage() {
	const products = [
		{
			id: 1,
			image: '/src/assets/images/image 173.svg',
			title: 'Blend N8s',
			description: '100 % Arabica. Gavalı, şokolad və kakao dənələri',
			price: '18.00 AZN',
			category: 'anar', // Kateqoriya əlavə edildi
		},
		{
			id: 2,
			image: '/src/assets/images/image 173.svg',
			title: 'Blend N9s',
			description: '100 % Arabica. Qoz, şokolad və vanil dadı',
			price: '20.00 AZN',
			category: 'anar',
		},
		{
			id: 3,
			image: '/src/assets/images/image 173.svg',
			title: 'Blend N10s',
			description: '100 % Arabica. Fındıq, şokolad və karamel notları',
			price: '22.00 AZN',
			category: 'anar',
		},
		{
			id: 4,
			image: '/src/assets/images/image 173.svg',
			title: 'Blend N8',
			description: '100 % Arabica. Gavalı, şokolad və kakao dənələri',
			price: '18.00 AZN',
			category: 'coffee', // Kateqoriya əlavə edildi
		},
		{
			id: 5,
			image: '/src/assets/images/image 173.svg',
			title: 'Blend N9',
			description: '100 % Arabica. Qoz, şokolad və vanil dadı',
			price: '20.00 AZN',
			category: 'coffee',
		},
		{
			id: 6,
			image: '/src/assets/images/image 173.svg',
			title: 'Blend N10',
			description: '100 % Arabica. Fındıq, şokolad və karamel notları',
			price: '22.00 AZN',
			category: 'coffee',
		},
		{
			id: 7,
			image: '/src/assets/images/image 173.svg',
			title: 'Blend N8',
			description: '100 % Arabica. Gavalı, şokolad və kakao dənələri',
			price: '18.00 AZN',
			category: 'coffee', // Kateqoriya əlavə edildi
		},
		{
			id: 8,
			image: '/src/assets/images/image 173.svg',
			title: 'Blend N9',
			description: '100 % Arabica. Qoz, şokolad və vanil dadı',
			price: '20.00 AZN',
			category: 'coffee',
		},
		{
			id: 9,
			image: '/src/assets/images/image 173.svg',
			title: 'Blend N10',
			description: '100 % Arabica. Fındıq, şokolad və karamel notları',
			price: '2222.00 AZN',
			category: 'coffee',
		},
		// Digər məhsullar da eyni şəkildə...
	];

	// Pagination üçün state
	const [currentPage, setCurrentPage] = useState(1);
	const productsPerPage = 3;

	// Aktiv tab üçün state
	const [activeTab, setActiveTab] = useState('all');

	// Məhsulları filtr edirik
	const filteredProducts =
		activeTab === 'all'
			? products
			: products.filter((product) => product.category === activeTab);

	// Cari səhifənin məhsullarını hesablamaq
	const indexOfLastProduct = currentPage * productsPerPage;
	const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
	const currentProducts = filteredProducts.slice(
		indexOfFirstProduct,
		indexOfLastProduct
	);

	// Tab klik funksiyası
	const handleTabClick = (tab) => {
		setActiveTab(tab);
		setCurrentPage(1); // Tab dəyişəndə səhifəni 1-ə qaytarırıq
	};

	return (
		<>
			<div className="product-wrapper">
				<div className="product">
					<div className="section-wrapper">
						<div className="bread-crumbs">
							<Link to="/" className="break-link">
								Home{' '}
							</Link>
							<span> /</span>
							<Link to="/about"> Product</Link>
						</div>
						<div className="product-tabs-buttons">
							<ul className="tab-list">
								<li
									className={`tab-item ${activeTab === 'all' ? 'active' : ''}`}
									onClick={() => handleTabClick('all')}
								>
									All product
								</li>
								<li
									className={`tab-item ${
										activeTab === 'coffee' ? 'active' : ''
									}`}
									onClick={() => handleTabClick('coffee')}
								>
									Coffee
								</li>
							</ul>
						</div>
						<div className="products_container">
							{currentProducts.map((product) => (
								<div className="single-product" key={product.id}>
									<img src={product.image} alt={product.title} />
									<h5>{product.title}</h5>
									<p className="product-description">{product.description}</p>
									<p className="price">
										<span>{product.price.split(' ')[0]}</span> AZN
									</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Səhifələmə komponenti */}
			<Pagination
				currentPage={currentPage}
				totalPages={Math.ceil(filteredProducts.length / productsPerPage)}
				onPageChange={setCurrentPage}
			/>
		</>
	);
}

export default Productspage;
