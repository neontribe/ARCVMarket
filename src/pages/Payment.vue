<template>
    <div>
        <main class="container" id="payment">

            <div class="content fullwidth">
                <h1>Requested Payments</h1>

                <div class="accordion">

                    <!-- Tab header -->
                    <div class="tab thead">
                        <label for="tab-one">
                            <div class="row">
                                <div>Date</div>
                                <div>Voucher total</div>
                                <div>Amount</div>
                            </div>
                        </label>
                    </div>

                    <!-- Tab row -->
                    <div class="tab row">
                        <input id="tab-two" type="checkbox" name="tabs">
                        <label for="tab-two">
                            <div class="row">
                                <div>1/2/17</div>
                                <div>36</div>
                                <div class="amount">£36</div>
                            </div>
                        </label>
                        <div class="tab-content">
                            <div class="tab">
                                <label for="">
                                    <div class="row-code">
                                        <div class="code">RVP12345561</div>
                                        <div class="date">12/1/17</div>
                                    </div>
                                    <div class="row-code">
                                        <div class="code">RVP12345563</div><div class="date">12/1/17</div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <!-- Tab row -->
                    <div class="tab row">
                        <input id="tab-three" type="checkbox" name="tabs">
                        <label for="tab-three">
                            <div class="row">
                                <div>13/3/17</div>
                                <div>68</div>
                                <div class="amount">£68</div>
                            </div>
                        </label>
                        <div class="tab-content">
                            <div class="tab">
                                <label for="">
                                    <div class="row-code">
                                        <div class="code">RVP12345561</div>
                                        <div class="date">12/1/17</div>
                                    </div>
                                    <div class="row-code">
                                        <div class="code">RVP12345563</div><div class="date">12/1/17</div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <!-- Tab row -->
                    <div class="tab row">
                        <input id="tab-four" type="checkbox" name="tabs">
                        <label for="tab-four">
                            <div class="row">
                                <div>28/4/17</div>
                                <div>41</div>
                                <div class="amount">£41</div>
                            </div>
                        </label>
                        <div class="tab-content">
                            <div class="tab">
                                <label for="">
                                    <div class="row-code">
                                        <div class="code">RVP12345561</div>
                                        <div class="date">12/1/17</div>
                                    </div>
                                    <div class="row-code">
                                        <div class="code">RVP12345563</div>
                                        <div class="date">12/1/17</div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                </div>

                <button class="smaller">Get a payment</button>

            </div>

        </main>
    </div>
</template>

<script>
export default {
    name: 'payment',
    data() {
        return {
            selected: false
        }
    }
}

</script>
