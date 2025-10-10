import React from 'react';

type Props = {
  name: string;
  price: number;
  features: string[];
};

const PricingCard: React.FC<Props> = ({ name, price, features }) => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-6 max-w-sm">
      <h3 className="text-xl font-semibold mb-2">{name}</h3>
      <div className="text-3xl font-bold mb-4">${price}/mo</div>
      <ul className="mb-4 space-y-2">
        {features.map((f, i) => (
          <li key={i} className="text-sm">• {f}</li>
        ))}
      </ul>
      <button className="bg-emerald-500 hover:bg-emerald-600 text-black px-4 py-2 rounded">Comenzar</button>
    </div>
  );
};

export default PricingCard;
