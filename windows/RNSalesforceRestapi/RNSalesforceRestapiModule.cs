using ReactNative.Bridge;
using System;
using System.Collections.Generic;
using Windows.ApplicationModel.Core;
using Windows.UI.Core;

namespace Com.Reactlibrary.RNSalesforceRestapi
{
    /// <summary>
    /// A module that allows JS to share data.
    /// </summary>
    class RNSalesforceRestapiModule : NativeModuleBase
    {
        /// <summary>
        /// Instantiates the <see cref="RNSalesforceRestapiModule"/>.
        /// </summary>
        internal RNSalesforceRestapiModule()
        {

        }

        /// <summary>
        /// The name of the native module.
        /// </summary>
        public override string Name
        {
            get
            {
                return "RNSalesforceRestapi";
            }
        }
    }
}
