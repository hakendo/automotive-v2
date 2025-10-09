import type { Datum } from "../../types/vehicule";
import { formatNameForURL } from "../../helpers/stringHelpers";
import { formatPrice } from "../../helpers/formatHelpers";

interface VehicleCardProps {
  readonly vehicle: Datum;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const formattedPrice = formatPrice(vehicle.price);

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <a href={`/vehiculos/${formatNameForURL(vehicle.name)}`}>
          <img
            src={vehicle.imageUrl}
            alt={vehicle.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </a>

        {/* Status Badge */}
        <div className="absolute top-3 right-3 space-y-2 text-right">
          {vehicle.label && (
            <div className="inline-block bg-gray-900 bg-opacity-70 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm">
              {vehicle.label}
            </div>
          )}
          {vehicle.available ? (
            <div className="inline-block bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              ✓ Disponible
            </div>
          ) : (
            <div className="inline-block bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg"> {/* <-- CAMBIO de color */}
              ✕ Vendido
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Title */}
        <div className="mb-3 flex-grow">
          <h3 className="font-semibold text-gray-900 text-md leading-tight line-clamp-2 mb-1 h-12">
            <a
              href={`/vehiculos/${formatNameForURL(vehicle.name)}`}
              className="hover:text-ac-blue transition-colors"
            >
              {vehicle.name}
            </a>
          </h3>
        </div>

        {/* Vehicle Details */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1" title="Kilometraje">
              <span className="text-gray-400">🚗</span>
              <span>{vehicle.miles?.toLocaleString()} km</span>
            </div>
            <div className="flex items-center space-x-1" title="Combustible">
              <span className="text-gray-400">⛽</span>
              <span>{vehicle.fuelType}</span>
            </div>
            <div className="flex items-center space-x-1" title="Transmisión">
              <span className="text-gray-400">⚙️</span>
              <span>{vehicle.transmission}</span>
            </div>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <div>
            <p className="text-sm text-gray-500">Precio</p>
            <p className="text-lg font-bold text-gray-900">
              {formattedPrice}
            </p>
          </div>

          {/* CTA Button */}
          <a
            href={`/vehiculos/${formatNameForURL(vehicle.name)}`}
            className="bg-ac-blue hover:opacity-90 text-white px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md" /* <-- CAMBIOS DE COLOR */
          >
            Ver más
          </a>
        </div>
      </div>
    </div>
  );
}