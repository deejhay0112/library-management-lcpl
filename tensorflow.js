(async function main() {
    // Fetch data from PHP backend
    async function fetchData() {
        try {
            const response = await fetch("https://lcplportal.net/fetch_data_pred.php", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) throw new Error(`Failed to fetch data: ${response.status}`);
            const data = await response.json();
            return data.map(row => ({
                year: parseInt(row.year),
                month: parseInt(row.month),
                visitors: parseInt(row.visitors),
            }));
        } catch (error) {
            console.error("Error fetching data:", error);
            return [];
        }
    }

    // Preprocess and normalize the data
    function preprocessData(data) {
        const features = [];
        const labels = [];

        for (let i = 3; i < data.length; i++) {
            const lag1 = data[i - 1].visitors;
            const lag2 = data[i - 2].visitors;
            const lag3 = data[i - 3].visitors;
            const month = data[i].month;

            const monthSin = Math.sin((2 * Math.PI * month) / 12);
            const monthCos = Math.cos((2 * Math.PI * month) / 12);

            features.push([data[i].year, monthSin, monthCos, lag1, lag2, lag3]);
            labels.push(data[i].visitors);
        }

        const maxYear = Math.max(...data.map(row => row.year));
        const maxVisitors = Math.max(...labels);

        const normalizedFeatures = features.map(([year, monthSin, monthCos, lag1, lag2, lag3]) => [
            year / maxYear,
            monthSin,
            monthCos,
            lag1 / maxVisitors,
            lag2 / maxVisitors,
            lag3 / maxVisitors,
        ]);
        const normalizedLabels = labels.map(label => label / maxVisitors);

        return { features: normalizedFeatures, labels: normalizedLabels, maxYear, maxVisitors };
    }

    // Train the model
    async function trainModel(features, labels) {
        const xs = tf.tensor2d(features);
        const ys = tf.tensor1d(labels);

        const model = tf.sequential();
        model.add(tf.layers.dense({ units: 256, activation: "relu", inputShape: [6] }));
        model.add(tf.layers.dropout({ rate: 0.3 }));
        model.add(tf.layers.dense({ units: 128, activation: "relu" }));
        model.add(tf.layers.dense({ units: 64, activation: "relu" }));
        model.add(tf.layers.dense({ units: 1 }));

        model.compile({
            optimizer: tf.train.adam(0.0005),
            loss: "meanSquaredError",
        });

        await model.fit(xs, ys, {
            epochs: 500,
            batchSize: 16,
            shuffle: true,
            validationSplit: 0.2,
            verbose: 1,
        });

        return model;
    }

    // Predict future visitor counts
    function predictFuture(model, startYear, startMonth, futureMonths, maxYear, maxVisitors, lastVisitors) {
        const predictions = [];
        const futureLabels = [];
        let [lag1, lag2, lag3] = lastVisitors;
        let year = startYear;
        let month = startMonth;

        for (let i = 0; i < futureMonths; i++) {
            const monthSin = Math.sin((2 * Math.PI * month) / 12);
            const monthCos = Math.cos((2 * Math.PI * month) / 12);

            const feature = [year / maxYear, monthSin, monthCos, lag1 / maxVisitors, lag2 / maxVisitors, lag3 / maxVisitors];
            const prediction = model.predict(tf.tensor2d([feature])).dataSync()[0] * maxVisitors;
            predictions.push(Math.round(prediction));

            futureLabels.push(`${year}-${String(month).padStart(2, "0")}`);
            lag3 = lag2;
            lag2 = lag1;
            lag1 = prediction;

            month++;
            if (month > 12) {
                month = 1;
                year++;
            }
        }

        return { predictions, futureLabels };
    }

    // Render chart
    function renderChart(labels, predictions) {
        const ctx = document.getElementById("monthlyvisitorChart").getContext("2d");
        new Chart(ctx, {
            type: "line",
            data: {
                labels,
                datasets: [
                    {
                        label: "Predicted Visitor Counts",
                        data: predictions,
                        borderColor: "rgba(54, 162, 235, 1)",
                        backgroundColor: "rgba(54, 162, 235, 0.2)",
                        fill: true,
                        tension: 0.4,
                    },
                ],
            },
            options: {
                responsive: true,
                scales: {
                    x: { title: { display: true, text: "Month" } },
                    y: { title: { display: true, text: "Visitor Count" } },
                },
            },
        });
    }

    // Main execution
    const historicalData = await fetchData();

    if (historicalData.length === 0) {
        console.error("No data available for training.");
        return;
    }

    const { features, labels, maxYear, maxVisitors } = preprocessData(historicalData);
    const model = await trainModel(features, labels);

    const lastEntry = historicalData[historicalData.length - 1];
    const futureMonths = 6;
    const lastVisitors = [
        historicalData[historicalData.length - 1].visitors,
        historicalData[historicalData.length - 2].visitors,
        historicalData[historicalData.length - 3].visitors,
    ];
    const { predictions, futureLabels } = predictFuture(
        model,
        lastEntry.year,
        lastEntry.month + 1,
        futureMonths,
        maxYear,
        maxVisitors,
        lastVisitors
    );

    renderChart(futureLabels, predictions);
})();
