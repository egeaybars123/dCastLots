export const shortenAddress = (address) => {
    let new_address;
    new_address = address.substring(0, 6);
    new_address += "...";
    new_address += address.substring(address.length-6, address.length);

    return new_address;
}
