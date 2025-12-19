export const isJsonString = (data) => {
    try {
        JSON.parse(data)
    } catch (error) {
        return false
    }
    return true
}
export const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
export function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}
export const renderOptions = (arr) => {
    let results = []
    if (arr) {
        results = arr?.map((opt) => {
            return {
                value: opt,
                label: opt
            }
        })
    }
    results.push({
        label: 'Thêm type',
        value: 'add_type'
    })
    return results
}
export const converPrice = (price) => {
    try {
        const result = price?.toString().replace(',', '.')
        return `${result} VND`
    } catch (err) {
        return null
    }
}

// Tính toán "độ tiết kiệm điện" cho sản phẩm trên frontend
export const computeEfficiency = (product) => {
    if (!product) return 0
    if (typeof product.efficiency === 'number') return product.efficiency

    // Nếu có thông số kỹ thuật, tìm giá trị watt (W/kW) để suy ra độ tiết kiệm
    const specs = product.specifications || {}
    const values = Object.values(specs)
    for (let v of values) {
        if (!v || typeof v !== 'string') continue
        const m = v.match(/(\d+(?:[.,]\d+)?)\s*(k?W|kw|W|watt|Watt)/i)
        if (m) {
            let num = parseFloat(m[1].replace(',', '.'))
            const unit = (m[2] || '').toLowerCase()
            if (unit.includes('kw')) num = num * 1000
            const watt = num
            // Đơn giản: càng ít watt => càng tiết kiệm => điểm cao
            if (watt <= 50) return 5
            if (watt <= 100) return 4
            if (watt <= 200) return 3
            if (watt <= 400) return 2
            return 1
        }
    }

    // Fallback: nếu có rating số (từ backend), dùng tạm làm efficiency
    if (typeof product.rating === 'number') return Math.round(product.rating)

    // Mặc định trung bình
    return 3
}

export const initFacebookSDK = () => {
    if (window.FB) {
        window.FB.XFBML.parse(); // Sửa từ XHTML.parse() thành XFBML.parse()
        return;
    }

    let locale = "vi_VN"; // Sửa từ "v1_vN" thành "vi_VN"

    window.fbAsyncInit = function () {
        window.FB.init({
            appId: process.env.REACT_APP_FB_ID, // Bỏ ký tự $ ở đầu
            cookie: true, // enable cookies to allow the server to access the session
            xfbml: true, // Sửa từ xfbm1 thành xfbml
            version: "v18.0" // Cập nhật version mới hơn
        });
    };

    // Load the SDK asynchronously
    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0]; // Sửa từ getElementByTagName thành getElementsByTagName
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = `https://connect.facebook.net/${locale}/sdk.js`; // Sửa từ drc thành src, thêm https://
        fjs.parentNode.insertBefore(js, fjs);
    }(document, "script", "facebook-jssdk")); // Sửa dấu ngoặc và ID
};
export const parsePrice = (str) => {
    if (typeof str === 'number') return str;
    return Number(String(str).replace(/[^\d]/g, '')) || 0;
};
export const getDataChart = (orders) => {
    if (!Array.isArray(orders)) return [];

    const revenueChuaGiao = orders
        .filter((o) => !o.isDelivered)
        .reduce((sum, o) => sum + parsePrice(o.totalPrice || 0), 0);

    const revenueDaGiao = orders
        .filter((o) => o.isDelivered)
        .reduce((sum, o) => sum + parsePrice(o.totalPrice || 0), 0);

    return [
        { name: 'Chưa giao hàng', revenue: revenueChuaGiao },
        { name: 'Đã giao hàng', revenue: revenueDaGiao },
    ];
};